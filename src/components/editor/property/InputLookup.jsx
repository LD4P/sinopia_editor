// Copyright 2020 Stanford University see LICENSE for license

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { selectModalType } from 'selectors/modals'
import { connect, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { displayResourceValidations } from 'selectors/errors'
import { selectNormValues, selectCurrentResourceIsReadOnly } from 'selectors/resources'
import _ from 'lodash'
import { removeValue } from 'actions/resources'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import ResourceList from './ResourceList'
import Lookup from './Lookup'

const InputLookup = (props) => {
  const displayValidations = useSelector((state) => displayResourceValidations(state, props.property.rootSubjectKey))
  const errors = props.property.errors
  const readOnly = useSelector((state) => selectCurrentResourceIsReadOnly(state))
  const isRepeatable = props.propertyTemplate.repeatable
  const isDisabled = readOnly || (props.lookupValues.length > 0 && !isRepeatable)

  // LookupString is what appears in the input. Query is sent to Lookup.
  const [lookupString, setLookupString] = useState('')
  const [query, setQuery] = useState('')

  const [showLookup, setShowLookup] = useState(false)


  let error
  const controlClasses = ['form-control']
  if (displayValidations && !_.isEmpty(errors)) {
    controlClasses.push('is-invalid')
    error = errors.join(',')
  }

  const handleLookupChange = (event) => {
    event.preventDefault()
    setLookupString(event.target.value)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      lookup()
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    lookup()
  }

  const hideLookup = (event) => {
    if (event) event.preventDefault()
    setShowLookup(false)
    setLookupString('')
  }

  const lookup = () => {
    setShowLookup(true)
    setQuery(lookupString)
  }

  const lookupSelection = props.lookupValues.map((lookupValue) => (
    <div key={lookupValue.key} className="lookup-value">
      <span key={lookupValue.key}>{lookupValue.label || lookupValue.literal}</span>
      <a href={lookupValue.uri} aria-label={`Link to value ${lookupValue.uri}`} target="_new">
        <span aria-hidden="true"><FontAwesomeIcon className="globe-icon" icon={faGlobe} /></span>
      </a>
      <button onClick={() => props.removeValue(lookupValue.key)}>
        <FontAwesomeIcon className="trash-icon" icon={faTrashAlt} />
      </button>
    </div>
  ))

  const inputId = `lookup-input-${props.property.key}`
  return (
    <React.Fragment>
      <div className="form-inline" style={{ marginBottom: '5px' }}>
        <label htmlFor={inputId}>Lookup</label>
        <input id={inputId} type="text" className={controlClasses.join(' ')}
               style={{ width: '750px', marginLeft: '5px' }}
               onChange={handleLookupChange}
               onKeyPress={handleKeyPress}
               placeholder="Enter lookup query"
               disabled={isDisabled}
               value={ lookupString } />
        <button className="btn btn-default"
                type="submit"
                title="Submit lookup"
                onClick={handleSubmit}
                disabled={isDisabled}
                aria-label={`Submit lookup for ${props.propertyTemplate.label}`}
                data-testid={`Submit lookup for ${props.propertyTemplate.label}`}>
          <FontAwesomeIcon className="fa-search" icon={faSearch} />
        </button>
      </div>
      {error && <span className="invalid-feedback">{error}</span>}
      <div className="row">
        { lookupSelection }
      </div>
      <ResourceList property={props.property} />
      <div className="row">
        <Lookup
          property={props.property}
          propertyTemplate={props.propertyTemplate}
          show={showLookup}
          hideLookup={hideLookup}
          query={query} />
      </div>
    </React.Fragment>
  )
}

InputLookup.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  show: PropTypes.bool,
  lookupValues: PropTypes.array,
  removeValue: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
  lookupValues: selectNormValues(state, ownProps.property?.valueKeys),
  show: selectModalType(state) === `InputLookupModal-${ownProps.property.key}`,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ removeValue }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLookup)
