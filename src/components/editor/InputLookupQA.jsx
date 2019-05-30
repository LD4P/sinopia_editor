// Copyright 2018 Stanford University see LICENSE for license
import React, { Component } from 'react'
import { asyncContainer, Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import Swagger from 'swagger-client'
import { connect } from 'react-redux'
import { getProperty } from '../../reducers/index'
import { changeSelections } from '../../actions/index'
import { defaultValuesFromPropertyTemplate } from '../../Utilities'

const AsyncTypeahead = asyncContainer(Typeahead)

class InputLookupQA extends Component {
  constructor(props) {
    super(props)

    const defaults = defaultValuesFromPropertyTemplate(this.props.propertyTemplate)

    if (defaults.length === 0)
      // Property templates do not require defaults but we like to know when this happens
      console.info(`no defaults defined in property template: ${JSON.stringify(this.props.propertyTemplate)}`)

    this.state = {
      isLoading: false,
      defaults: defaults
    }
    this.lookupClient = Swagger({ url: 'src/lib/apidoc.json' })
  }

  // Render menu function to be used by typeahead
  renderMenuFunc = (results, menuProps) => {
    // Returning results per each promise
    // If error is returned, it will be used to display for that source
    const items = []
    let menuItemIndex = 0

    results.forEach((result, _i, list) => {
      const authLabel = result.authLabel
      const headerKey = `${result.authURI}-header`

      if (list.length > 1)
        items.push(<Menu.Header key={headerKey}>{authLabel}</Menu.Header>)

      if (result.isError) {
        const errorMessage = 'An error occurred in retrieving results'
        const errorHeaderKey = `${headerKey}-error`
        items.push(<Menu.Header key={errorHeaderKey}>
                     <span className='dropdown-error'>{errorMessage}</span>
                   </Menu.Header>)

        // Effectively a `continue`/`next` statement within the `forEach()` context, skipping to the next iteration
        return
      }

      const body = result.body

      if (body.length === 0) {
        const noResultsMessage = 'No results for this lookup'
        const noResultsHeaderKey = `${headerKey}-noResults`

        items.push(<Menu.Header key={noResultsHeaderKey}>
                     <span className='dropdown-empty'>{noResultsMessage}</span>
                   </Menu.Header>)

        // Effectively a `continue`/`next` statement within the `forEach()` context, skipping to the next iteration
        return
      }

      body.forEach(innerResult => {
        items.push(<MenuItem option={innerResult} position={menuItemIndex} key={menuItemIndex}>
                     {innerResult.label}
                   </MenuItem>)
        menuItemIndex++
      })
    })

    return (
      <Menu {...menuProps} id={menuProps.id}>
        {items}
      </Menu>
    )
  }

  render() {
    let authority, subauthority, language
    const lookupConfigs = this.props.lookupConfig
    const maxRecords = 8
    const isMandatory = this.props.propertyTemplate.mandatory === undefined ?
          true :
          JSON.parse(this.props.propertyTemplate.mandatory)
    const isRepeatable = this.props.propertyTemplate.repeatable === undefined ?
          true :
          JSON.parse(this.props.propertyTemplate.repeatable)

    const typeaheadProps = {
      id: 'lookupComponent',
      required: isMandatory,
      multiple: isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
      defaultSelected: this.state.defaults,
      delay: 300
    }

    return (
      <div>
        <AsyncTypeahead renderMenu={(results, menuProps) => this.renderMenuFunc(results, menuProps)}

                        onSearch={query => {
                          this.setState({ isLoading: true })
                          this.lookupClient.then(client => {
                            //create array of promises based on the lookup config array that is sent in
                            const lookupPromises = lookupConfigs.map(lookupConfig => {
                              authority = lookupConfig.authority
                              subauthority = lookupConfig.subauthority
                              language = lookupConfig.language
                              //return the 'promise'
                              //Since we don't want promise.all to fail if
                              //one of the lookups fails, we want a catch statement
                              //at this level which will then return the error
                              //Subauthorities require a different API call than authorities so need to check if subauthority is available
                              //The only difference between this call and the next one is the call to Get_searchSubauthority instead of 
                              //Get_searchauthority.  If there is a way to somehow pass that in a variable name/dynamically, that would be better
                              if(subauthority) {
                                  return client
                                  .apis
                                  .SearchQuery
                                  .GET_searchSubauthority({
                                    q: query,
                                    vocab: authority,
                                    subauthority: subauthority,
                                    maxRecords: maxRecords,
                                    lang: language
                                  })
                                  .catch(function(err) {
                                    console.error("Error in executing lookup against source", err)
                                    //return information along with the error in its own object
                                    return { isError: true, errorObject: err }
                                  })
                                  
                              } else {
                                  return client
                                    .apis
                                    .SearchQuery
                                    .GET_searchAuthority({
                                      q: query,
                                      vocab: authority,
                                      subauthority: subauthority,
                                      maxRecords: maxRecords,
                                      lang: language
                                    })
                                    .catch(function(err) {
                                      console.error("Error in executing lookup against source", err)
                                      //return information along with the error in its own object
                                      return { isError: true, errorObject: err }
                                    })
                              }
                            })

                            Promise.all(lookupPromises).then(values => {
                              for (let i = 0; i < values.length; i++) {
                                //If undefined, add info - note if error, error object returned in object
                                //which allows attaching label and uri for authority
                                if (values[i]) {
                                  values[i].authLabel = lookupConfigs[i].label
                                  values[i].authURI = lookupConfigs[i].uri
                                }
                              }

                              this.setState( {
                                isLoading: false,
                                options: values
                              })
                            })
                          }).catch(() => false)
                        }}

                        onChange={selected => {
                          const payload = {
                            uri: this.props.propertyTemplate.propertyURI,
                            items: selected,
                            reduxPath: this.props.reduxPath
                          }
                          this.props.handleSelectedChange(payload)
                        }}

                        {...typeaheadProps}

                        filterBy={() => {
                          /** Currently don't want any default filtering as we want all the results returned from QA, also we are passing in a complex object **/
                          /* Your own filtering code goes here. */
                          return true
                        }}
        />
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
      useValuesFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    })
  }).isRequired,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
}

const mapStateToProps = (state, props) => {
  const result = getProperty(state, props)
  return { selected: result }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQA)
