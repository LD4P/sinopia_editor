// Copyright 2019 Stanford University see LICENSE for license
import React, { Component } from 'react'
import { getOptionLabel } from 'react-bootstrap-typeahead/lib/utils'

import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { connect } from 'react-redux'
import {
  itemsForProperty, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { changeSelections, removeItem } from 'actions/index'
import { getLookupConfigItems, isValidURI } from 'Utilities'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

// propertyTemplate of type 'lookup' does live QA lookup via API
//  based on values in propertyTemplate.valueConstraint.useValuesFrom
//  and the lookupConfig for the URIs has component value of 'lookup'
class InputLookupQAContext extends Component {
  constructor(props) {
    super(props)

    /*
     *selectedResultList is for the results selected from any query execution
     *selected which is stored in redux state for the lookup is for all of the values
     *stored
     */
    this.state = {
      show: false,
      query: '',
      selectedResultsList: [],
    }
  }

  // Add selections to selected uris for this field
  handleSubmit = () => {
    // Retrieve values of selected inputs
    let selected = this.state.selectedResultsList
    // we're switching out the selections entirely, not adding/removing
    selected = this.props.selected.concat(selected)
    // TODO: filter out duplicates
    const payload = {
      uri: this.props.propertyTemplate.propertyURI,
      items: selected,
      reduxPath: this.props.reduxPath,
    }

    /*
     * We want to add to, not replace selections but as first pass
     * we will replace
     */
    this.props.handleSelectedChange(payload)
    this.handleClose()
  }

  handleChange = (event) => {
    const usrInput = event.target.value
    this.setState({ query: usrInput })
  }


  handleClick = () => {
    const query = this.state.query
    // Display loading icon
    this.props.search(query)
    this.handleShow()
  }

  // handle selection of results from the search results in the modal
  handleResultChange = (event) => {
    const eventTarget = event.target
    const uri = eventTarget.value
    if (eventTarget.checked) {
      // Add uri and label to list of selected results if checked
      const label = eventTarget.getAttribute('label')

      /*
       * QA returns id as well which is NOT always the same as URI
       * Id saved in state can be used for removal later, so in this case, reusing URI
       */
      this.setState(prevState => ({ selectedResultsList: prevState.selectedResultsList.concat({ id: uri, uri, label }) }))
    } else {
      // remove item if unchecked
      this.setState(prevState => ({
        selectedResultsList: prevState.selectedResultsList.filter(r => r.uri !== uri),
      }))
    }
  }

  displayResults = () => {
    // const options = this.state.options
    if (this.props.isloading) {
      return this.generateLoadingSpinner()
    }
    const options = this.props.options
    if (options.length > 0) {
      return this.renderResults(options)
    }
    return 'No results'
  }

  renderResults = (results) => {
    /*
     * Returning results per each promise
     * If error is returned, it will be used to display for that source
     */
    const items = []
    let authLabel; let authURI; let headerKey; let i; let r; let result
    const resultsLength = results.length
    const headingStyle = {
      margin: '0 -15px',
      padding: '8px 0 4px 8px',
      backgroundColor: '#ccc',
    }

    let idx = 0
    for (i = 0; i < resultsLength; i++) {
      result = results[i]
      authLabel = result.authLabel
      authURI = result.authURI
      headerKey = `${authURI}-header`
      // Add header only if more than one authority request
      if (resultsLength > 1)
      { items.push(
        <h4 key={headerKey} style={headingStyle}>{authLabel}</h4>,
      ) }
      // For this authority, display results
      if ('isError' in result) {
        // if error, then get error from within result and display that message
        const errorMessage = 'An error occurred in retrieving results'
        const errorHeaderKey = `${headerKey}-error`
        items.push(
          <h4 key={errorHeaderKey}><span className="dropdown-error">{errorMessage}</span></h4>,
        )
      } else {
        // if not error, print out items for result
        r = result.body
        const resultItems = this.renderResultItems(r, idx, authURI)
        idx += resultItems.length
        resultItems.forEach((i) => { items.push(i) })
        // if the length of results is zero we need to show that as well
        if (r.length === 0) {
          const noResultsMessage = 'No results for this lookup'
          const noResultsHeaderKey = `${headerKey}-noResults`
          items.push(
            <div key={noResultsHeaderKey}><span className="dropdown-empty">{noResultsMessage}</span></div>,
          )
        }
      }
    }

    return (

      <div>{items}</div>

    )
  }

  renderResultItems = (r, idx, authURI) => {
    const labelStyle = {
      fontWeight: 'bold',
      fontSize: '18px',
      paddingLeft: '5px',
    }
    const resultItems = r.map((result, index) => {
      const divKey = `${idx}-${index}`
      const contextContent = this.renderContext(result.context, divKey, authURI)
      const resultContext = (<div> {contextContent} </div>)
      let bg = '#fff'
      idx++
      if (idx % 2 === 0) {
        bg = '#ede7d4'
      }
      const resultStyle = {
        backgroundColor: bg,
        padding: '4px 2px 2px 5px',
      }
      const divId = `row-${idx}`
      return (<div key={divId} className="row contextInfo" style={resultStyle} uri={result.uri}>
        <input type="checkbox" name="searchResultInput" value={result.uri} label={result.label} position={idx} key={idx} onChange={this.handleResultChange}/>
        <span style={labelStyle}>{result.label}</span>
        {resultContext}
      </div>)
    })
    return resultItems
  }


  renderInputAndButton = (id, typeaheadProps) => {
    const buttonSpacer = { marginBottom: '10px' }
    return (<div>
      <input
          className="form-control"
          id={`inputQAContext${id}`}
          onChange={this.handleChange}
          value={this.state.query}
          {...typeaheadProps}
      />
      <Button bsSize="small"
              onClick={this.handleClick} style={buttonSpacer}>Search</Button>
    </div>)
  }

  handleShow = () => {
    this.setState({ show: true })
  }

  handleClose = () => {
    /*
     * everytime we close, we should also clear out the results and selected results from the modal
     * as well as original results from the query
     */
    this.setState({ show: false, selectedResultsList: [] })
    // clear out options in the parent component
    this.props.clearOptions()
  }

  renderContext = (context, divKey, authURI) => {
    let contextContent = []
    const mainLabelProperty = ['authoritative label', 'preferred label']
    if (context) {
      if (authURI in authorityToContextOrderMap)
      { contextContent = this.generateOrderedContextView(authURI, context) }
      else
      { contextContent = this.generateDefaultContextView(context, mainLabelProperty) }
    }
    return (<div key={divKey}> {contextContent} </div>)
  }


  /*
   * Default rendering where on order is given, in this case the context will just be output in
   * its entirety.
   * mainLabelProperty: the array that holds the labels, we exclude that so as not to repeat it
   * this could be further generalized to a set of properties to be excluded from display if need be
   */
  generateDefaultContextView = (context, mainLabelProperty) => {
    const contextContent = context.map((contextResult, index) => {
      const property = contextResult.property
      // if property is one of the possible main label values don't show it
      if (mainLabelProperty.indexOf(property.toLowerCase()) < 0) {
        const values = contextResult.values
        // const values = [contextResult.value] //hack for wikidata, to be removed later
        const innerDivKey = `c${index}`
        if (values.length) {
          return (<div key={innerDivKey}> {property}: {values.join(', ')} </div>)
        }
      }
    })
    return contextContent
  }

  generateOrderedContextView = (authURI, context) => {
    // Map context to hash that allows for selection of specific properties
    const contextHash = context.reduce((map, obj) => (map[obj.property] = obj, map), {})
    const propertyOrder = authorityToContextOrderMap[authURI]
    const contextContent = propertyOrder.map((property, index) => {
      if (property in contextHash) {
        const values = contextHash[property].values
        const innerDivKey = `c${index}`
        if (values.length) {
          return (<div key={innerDivKey}> {property}: {values.join(', ')} </div>)
        }
      }
    })
    return contextContent
  }

  // loading spinner
  generateLoadingSpinner = () => (<div key="loadingicon"><FontAwesomeIcon icon={faSpinner} className="fa-spin fa-3x" /></div>)


  dispModal = (id, typeaheadProps) => (
    <Modal show={this.state.show} onHide={this.handleClose} id={`modal${id}`}>
      <Modal.Header closeButton>
        <Modal.Title>Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.renderInputAndButton(`modalInput-${id}`, typeaheadProps)}
        {this.displayResults()}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.handleSubmit}>Save</Button>
        <Button onClick={this.handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )

  makeAddedList = () => {
    const selected = this.props.selected

    if (selected === undefined) {
      return
    }
    const elements = selected.map((obj) => {
      const itemId = obj.uri

      return <div id="userInput" key = {itemId} >
        {obj.label}
        <button
            id="deleteItem"
            type="button"
            onClick={this.handleDeleteClick}
            key={`delete${obj.uri}`}
            data-item={itemId}
            data-label={obj.label}
        >X
        </button>
      </div>
    })

    return elements
  }

  handleDeleteClick = (event) => {
    this.props.handleRemoveItem(this.props.reduxPath, event.target.dataset.item)
    this.setState({ disabled: false })
  }

  render() {
    // Don't render if don't have property templates yet.
    if (!this.props.propertyTemplate) {
      return null
    }

    const typeaheadProps = {
      id: 'lookupComponent',
      required: this.props.isMandatory,
      multiple: this.props.isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      options: this.props.options,
      selected: this.props.selected,
      delay: 300,
    }

    return (
      <div>
        <input
                className="form-control"
                id={`inputQAContext${this.props.key}`}
                onChange={this.handleChange}
                {...typeaheadProps}
        />
        <Button bsSize="small"
                onClick={this.handleClick}>Search</Button>
        {this.dispModal(this.props.key, typeaheadProps)}
        {this.makeAddedList()}
      </div>
    )
  }
}

const authorityToContextOrderMap = {
  'urn:ld4p:qa:names:person': ['Descriptor',
    'Birth date', 'Death date',
    'Affiliation', 'Field of Activity',
    'Occupation', 'Birth place', 'Death place', 'VIAF match', 'Variant label', 'Citation note', 'Citation source', 'Editorial note'],
  'urn:ld4p:qa:names:organization': ['Descriptor', 'Location', 'Field of Activity', 'Affiliation', 'Occupation', 'VIAF match', 'Variant label',
    'Citation note', 'Citation source', 'Editorial note'],
}


InputLookupQAContext.propTypes = {
  displayValidations: PropTypes.bool,
  handleSelectedChange: PropTypes.func,
  handleRemoveItem: PropTypes.func,
  lookupConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selected: PropTypes.arrayOf(PropTypes.object),
  errors: PropTypes.array,
  search: PropTypes.func,
  isloading: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  isMandatory: PropTypes.bool,
  isRepeatable: PropTypes.bool,
  clearOptions: PropTypes.func,
  key: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const lookupConfig = getLookupConfigItems(propertyTemplate)
  const errors = findErrors(state.selectorReducer, ownProps.reduxPath)

  // Make sure that every item has a label
  // This is a temporary strategy until label lookup is implemented.
  const selected = itemsForProperty(state.selectorReducer, ownProps.reduxPath).map((item) => {
    const newItem = { ...item }
    if (newItem.label === undefined) {
      newItem.label = newItem.uri
    }
    return newItem
  })

  return {
    selected,
    reduxPath,
    propertyTemplate,
    displayValidations,
    lookupConfig,
    errors,
  }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  },
  handleRemoveItem(reduxPath, itemId) {
    dispatch(removeItem(reduxPath, itemId))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQAContext)
