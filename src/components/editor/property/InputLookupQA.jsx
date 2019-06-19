// Copyright 2018 Stanford University see LICENSE for license
import React, { Component } from 'react'
import {
  Menu, MenuItem, Typeahead, asyncContainer,
} from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import Swagger from 'swagger-client'
import swaggerSpec from 'lib/apidoc.json'
import { connect } from 'react-redux'
import { itemsForProperty, getDisplayValidations, getPropertyTemplate } from 'selectors/resourceSelectors'
import { changeSelections } from 'actions/index'
import { booleanPropertyFromTemplate, defaultValuesFromPropertyTemplate, getLookupConfigItems } from 'Utilities'
import Config from 'Config'

const AsyncTypeahead = asyncContainer(Typeahead)

class InputLookupQA extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
    }
  }

  // Render menu function to be used by typeahead
  renderMenuFunc = (results, menuProps) => {
    const items = []
    let menuItemIndex = 0

    /*
     * Returning results per each promise
     * If error is returned, it will be used to display for that source
     */
    results.forEach((result, _i, list) => {
      const authLabel = result.authLabel
      const headerKey = `${result.authURI}-header`

      if (list.length > 1) items.push(<Menu.Header key={headerKey}>{authLabel}</Menu.Header>)

      if (result.isError) {
        const errorMessage = 'An error occurred in retrieving results'
        const errorHeaderKey = `${headerKey}-error`

        items.push(
          <Menu.Header key={errorHeaderKey}>
            <span className="dropdown-error">{errorMessage}</span>
          </Menu.Header>,
        )

        // Effectively a `continue`/`next` statement within the `forEach()` context, skipping to the next iteration
        return
      }

      const body = result.body

      if (body.length === 0) {
        const noResultsMessage = 'No results for this lookup'
        const noResultsHeaderKey = `${headerKey}-noResults`

        items.push(
          <Menu.Header key={noResultsHeaderKey}>
            <span className="dropdown-empty">{noResultsMessage}</span>
          </Menu.Header>,
        )

        // Effectively a `continue`/`next` statement within the `forEach()` context, skipping to the next iteration
        return
      }

      body.forEach((innerResult) => {
        items.push(
          <MenuItem option={innerResult} position={menuItemIndex} key={menuItemIndex}>
            {innerResult.label}
          </MenuItem>,
        )
        menuItemIndex++
      })
    })

    return (
      <Menu {...menuProps} id={menuProps.id}>
        {items}
      </Menu>
    )
  }

  get isMandatory() {
    return booleanPropertyFromTemplate(this.props.propertyTemplate, 'mandatory', false)
  }

  get isRepeatable() {
    return booleanPropertyFromTemplate(this.props.propertyTemplate, 'repeatable', true)
  }

  validate() {
    if (!this.typeahead) {
      return
    }
    const selected = this.typeahead.getInstance().state.selected

    return this.props.displayValidations && this.isMandatory && selected.length < 1 ? 'Required' : undefined
  }

  search() {
    const lookupConfigs = this.props.lookupConfig

    return (query) => {
      this.setState({ isLoading: true })
      Swagger({ spec: swaggerSpec }).then((client) => {
        // Create array of promises based on the lookup config array that is sent in
        const lookupPromises = lookupConfigs.map((lookupConfig) => {
          const authority = lookupConfig.authority
          const subauthority = lookupConfig.subauthority
          const language = lookupConfig.language

          /*
           *Return the 'promise'
           *Since we don't want promise.all to fail if
           *one of the lookups fails, we want a catch statement
           *at this level which will then return the error. Subauthorities require a different API call than authorities so need to check if subauthority is available
           *The only difference between this call and the next one is the call to Get_searchSubauthority instead of
           *Get_searchauthority.  Passing API call in a variable name/dynamically, thanks @mjgiarlo
           */
          const actionFunction = subauthority ? 'GET_searchSubauthority' : 'GET_searchAuthority'

          return client
            .apis
            .SearchQuery?.[actionFunction]({
              q: query,
              vocab: authority,
              subauthority,
              maxRecords: Config.maxRecordsForQALookups,
              lang: language,
            })
            .catch((err) => {
              console.error('Error in executing lookup against source', err)
              // Return information along with the error in its own object
              return { isError: true, errorObject: err }
            })
        })

        /*
         * If undefined, add info - note if error, error object returned in object
         * which allows attaching label and uri for authority
         */
        Promise.all(lookupPromises).then((values) => {
          for (let i = 0; i < values.length; i++) {
            if (values[i]) {
              values[i].authLabel = lookupConfigs[i].label
              values[i].authURI = lookupConfigs[i].uri
            }
          }

          this.setState({
            isLoading: false,
            options: values,
          })
        })
      }).catch((e) => {
        console.error(e)
      })
    }
  }

  render() {
    // Don't render if don't have property templates yet.
    if (!this.props.propertyTemplate) {
      return null
    }

    const defaults = defaultValuesFromPropertyTemplate(this.props.propertyTemplate)

    const typeaheadProps = {
      id: 'lookupComponent',
      required: this.isMandatory,
      multiple: this.isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      onSearch: this.search(),
      options: this.state.options,
      defaultSelected: defaults,
      delay: 300,
    }

    let groupClasses = 'form-group'
    const error = this.validate()

    if (error) {
      groupClasses += ' has-error'
    }

    return (
      <div className={groupClasses}>
        <AsyncTypeahead renderMenu={(results, menuProps) => this.renderMenuFunc(results, menuProps)}
                        ref={typeahead => this.typeahead = typeahead }
                        onChange={(selected) => {
                          const payload = {
                            uri: this.props.propertyTemplate.propertyURI,
                            items: selected,
                            reduxPath: this.props.reduxPath,
                          }

                          this.props.handleSelectedChange(payload)
                        }}

                        {...typeaheadProps}

                        filterBy={() => true
                        }
        />
        {error && <span className="help-block">{error}</span>}
      </div>
    )
  }
}

InputLookupQA.propTypes = {
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    mandatory: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }),
  }),
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  displayValidations: PropTypes.bool,
  lookupConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
}

const mapStateToProps = (state, props) => {
  const reduxPath = props.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const lookupConfig = getLookupConfigItems(propertyTemplate)

  return {
    selected: itemsForProperty(state.selectorReducer, props.reduxPath),
    reduxPath,
    propertyTemplate,
    displayValidations,
    lookupConfig,
  }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQA)
