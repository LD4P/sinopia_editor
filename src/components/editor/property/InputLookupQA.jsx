// Copyright 2018 Stanford University see LICENSE for license
import React, { Component } from 'react'
import {
  Menu, MenuItem, Typeahead, asyncContainer,
} from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import Swagger from 'swagger-client'
import swaggerSpec from '../../../lib/apidoc.json'
import { connect } from 'react-redux'
import { getProperty } from '../../../reducers/index'
import { changeSelections } from '../../../actions/index'
import { booleanPropertyFromTemplate, defaultValuesFromPropertyTemplate } from '../../../Utilities'
import Config from '../../../Config'

const AsyncTypeahead = asyncContainer(Typeahead)

class InputLookupQA extends Component {
  constructor(props) {
    super(props)

    const defaults = defaultValuesFromPropertyTemplate(this.props.propertyTemplate)

    if (defaults.length === 0) {
      // Property templates do not require defaults but we like to know when this happens
      console.info(`no defaults defined in property template: ${JSON.stringify(this.props.propertyTemplate)}`)
    }

    this.state = {
      isLoading: false,
      defaults,
    }

    this.lookupClient = Swagger({ spec: swaggerSpec })
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

  render() {
    let authority
    let language
    let subauthority
    const lookupConfigs = this.props.lookupConfig
    const typeaheadProps = {
      id: 'lookupComponent',
      required: this.isMandatory,
      multiple: this.isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
      defaultSelected: this.state.defaults,
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
                        onSearch={(query) => {
                          this.setState({ isLoading: true })
                          this.lookupClient.then((client) => {
                            // Create array of promises based on the lookup config array that is sent in
                            const lookupPromises = lookupConfigs.map((lookupConfig) => {
                              authority = lookupConfig.authority
                              subauthority = lookupConfig.subauthority
                              language = lookupConfig.language

                              /*
                               *Return the 'promise'
                               *Since we don't want promise.all to fail if
                               *one of the lookups fails, we want a catch statement
                               *at this level which will then return the error. Subauthorities require a different API call than authorities so need to check if subauthority is available
                               *The only difference between this call and the next one is the call to Get_searchSubauthority instead of
                               *Get_searchauthority.  Passing API call in a variable name/dynamically, thanks @mjgiarlo
                               */
                              const actionFunction = lookupConfig.subauthority ? 'GET_searchSubauthority' : 'GET_searchAuthority'

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
                          }).catch(() => false)
                        }}

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
  }).isRequired,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state, props) => {
  const result = getProperty(state, props)


  return { selected: result }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQA)
