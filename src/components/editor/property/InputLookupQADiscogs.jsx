// Copyright 2018 Stanford University see LICENSE for license
import React, { Component } from 'react'
import {
  Menu, MenuItem, Typeahead, asyncContainer,
} from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import Swagger from 'swagger-client'
import swaggerSpec from 'lib/apidoc.json'
import { connect } from 'react-redux'
import { getProperty, getDisplayValidations, getPropertyTemplate } from 'reducers/index'
import { changeSelections } from 'actions/index'
import { booleanPropertyFromTemplate, defaultValuesFromPropertyTemplate, getLookupConfigItems } from 'Utilities'
import Config from 'Config'

const AsyncTypeahead = asyncContainer(Typeahead)

class InputLookupQADiscogs extends Component {
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
    console.log('Initiated Input lookup qa typeahead')
    this.lookupClient = Swagger({ spec: swaggerSpec })
  }

  /*
   *This function should be the same across different implementations of QA rendering
   *TODO: How to pull this out into a separate independent function ala Utilities or
   *pass in fro InputQA - tried the latter but ran into roadblocks
   */
  doSearch = (query) => {
    const lookupConfigs = this.props.lookupConfig
    let authority; let language; let
      subauthority
    this.setState({ isLoading: true })
    this.lookupClient.then((client) => {
      // create array of promises based on the lookup config array that is sent in
      const lookupPromises = lookupConfigs.map((lookupConfig) => {
        authority = lookupConfig.authority
        subauthority = lookupConfig.subauthority
        language = lookupConfig.language

        /*
         *  There are two types of lookup: linked data and non-linked data. The API calls
         *  for each type are different, so check the nonldLookup field in the lookup config.
         *  If the field is not set, assume false.
         */
        const nonldLookup = lookupConfig.nonldLookup ? lookupConfig.nonldLookup : false

        // default the API calls to their linked data values
        let subAuthCall = 'GET_searchSubauthority'
        let authorityCall = 'GET_searchAuthority'

        // Change the API calls if this is a non-linked data lookup
        if (nonldLookup) {
          subAuthCall = 'GET_nonldSearchWithSubauthority'
          authorityCall = 'GET_nonldSearchAuthority'
        }

        /*
         * return the 'promise'
         * Since we don't want promise.all to fail if
         * one of the lookups fails, we want a catch statement
         * at this level which will then return the error. Subauthorities require a different API call than authorities so need to check if subauthority is available
         * The only difference between this call and the next one is the call to Get_searchSubauthority instead of
         * Get_searchauthority.  Passing API call in a variable name/dynamically, thanks @mjgiarlo
         */
        const actionFunction = lookupConfig.subauthority ? subAuthCall : authorityCall

        return client
          .apis
          .SearchQuery?.[actionFunction]({
            q: query,
            vocab: authority,
            subauthority,
            maxRecords: Config.maxRecordsForQALookups,
            lang: language,
            context: true,
          })
            .catch((err) => {
              console.error('Error in executing lookup against source', err)
              // return information along with the error in its own object
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
  }

  renderContext = (innerResult, authLabel) => {
    switch (authLabel) {
      case 'Discogs':
        return this.buildDiscogsContext(innerResult)
      default:
        return innerResult.label
    }
  }

  buildDiscogsContext = (innerResult) => {
    const discogsContainer = {
      padding: '0 0 4px 3px',
    }

    const detailsContainer = {
      padding: '0 0 0 8px',
      whiteSpace: 'normal',
    }

    const imageContainer = {
      width: '50px',
      overflow: 'hidden',
      padding: '3px 0 0',
      textAlign: 'center',
    }

    const discogsImageStyle = {
      width: '100%',
      marginRight: '10px',
      verticalAlign: 'top',
    }

    const typeSpan = {
      paddingLeft: '8px',
    }


    const url = innerResult.uri
    const context = innerResult.context
    const image_url = context['Image URL'][0]
    let year = ''
    if (context.Year[0].length > 0) {
      year = `(${context.Year[0]})`
    }
    const rec_label = context['Record Labels'][0]
    const formats = context.Formats.toString()
    const discogs_type = context.Type[0]
    const target = '_blank'
    const type = context.Type[0].charAt(0).toUpperCase() + context.Type[0].slice(1)
    const row = 'row'
    const colTwo = 'col-md-2'
    const colTen = 'col-md-10'
    return (
      <div className={row} style={discogsContainer}>
        <div className={colTwo} style={imageContainer}>
          <img alt="Result" style={discogsImageStyle} src={image_url}/><br />
        </div>
        <div className={colTen} style={detailsContainer}>
          {innerResult.label} {year}<br />
          <b>Format: </b>{formats}<br />
          <b>Label: </b>{rec_label}<span style={typeSpan}><b>Type: </b>{type}</span>
        </div>
      </div>
    )
  }


  // Render menu function to be used by typeahead
  renderMenuFunc = (results, menuProps) => {
    const items = []
    let menuItemIndex = 0
    console.log('Inside render menu function')

    /*
     * Returning results per each promise
     * If error is returned, it will be used to display for that source
     */
    results.forEach((result, _i, list) => { console.log('Iterating through results')
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
      console.log('Get result body')
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
      // this differs from regular typeahead in that it retrieves and displays context
      body.forEach((innerResult) => {
        const itemContext = this.renderContext(innerResult, authLabel)
        items.push(
          <MenuItem option={innerResult} position={menuItemIndex} key={menuItemIndex}>
            {itemContext}
          </MenuItem>,
        )
        menuItemIndex++
      })
    })
    console.log('Before rendering the menu')
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
    // Don't render if don't have property templates yet.
    if (!this.props.propertyTemplate) {
      return null
    }

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
    console.log('Before rendering')
    return (
      <div className={groupClasses}>
        <AsyncTypeahead renderMenu={(results, menuProps) => this.renderMenuFunc(results, menuProps)}
                        ref={typeahead => this.typeahead = typeahead }
                        onSearch={query => this.doSearch(query)}

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

InputLookupQADiscogs.propTypes = {
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
}

const mapStateToProps = (state, props) => {
  const reduxPath = props.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const lookupConfig = getLookupConfigItems(propertyTemplate)

  return {
    selected: getProperty(state, props),
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

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQADiscogs)
