// Copyright 2020 Stanford University see LICENSE for license

import React, { useState, useRef } from "react"
import PropTypes from "prop-types"
import { selectModalType } from "selectors/modals"
import { connect, useSelector } from "react-redux"
import { bindActionCreators } from "redux"
import { displayResourceValidations } from "selectors/errors"
import {
  selectNormValues,
  selectCurrentResourceIsReadOnly,
} from "selectors/resources"
import _ from "lodash"
import { removeValue } from "actions/resources"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGlobe, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import ResourceList from "./ResourceList"
import Lookup from "./Lookup"
import useDiacritics from "hooks/useDiacriticsLegacy"
import DiacriticsSelection from "components/editor/diacritics/DiacriticsSelection"

const InputLookup = (props) => {
  const inputLookupRef = useRef(null)
  const id = `inputlookup-${props.property.key}`
  const diacriticsId = `diacritics-${props.property.key}`
  const {
    clearContent,
    handleKeyDownDiacritics,
    handleChangeDiacritics,
    handleBlurDiacritics,
    toggleDiacritics,
    closeDiacritics,
    handleAddCharacter,
    handleClickDiacritics,
    currentContent,
    showDiacritics,
  } = useDiacritics(inputLookupRef, id, diacriticsId)

  const displayValidations = useSelector((state) =>
    displayResourceValidations(state, props.property.rootSubjectKey)
  )
  const errors = props.property.errors
  const readOnly = useSelector((state) =>
    selectCurrentResourceIsReadOnly(state)
  )
  const isRepeatable = props.propertyTemplate.repeatable
  const isDisabled =
    readOnly || (props.lookupValues.length > 0 && !isRepeatable)

  // currentContent is what appears in the input. Query is sent to Lookup.
  const [query, setQuery] = useState("")

  const [showLookup, setShowLookup] = useState(false)

  let error
  const controlClasses = ["form-control"]
  if (displayValidations && !_.isEmpty(errors)) {
    controlClasses.push("is-invalid")
    error = errors.join(",")
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      lookup()
    }
    // Handle any position changing
    handleKeyDownDiacritics(event)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    lookup()
  }

  const hideLookup = (event) => {
    if (event) event.preventDefault()
    setShowLookup(false)
    clearContent()
  }

  const onSelectionChanged = () => {
    hideLookup()
    closeDiacritics()
  }

  const lookup = () => {
    setShowLookup(true)
    closeDiacritics()
    setQuery(currentContent)
  }

  const lookupSelection = props.lookupValues.map((lookupValue) => {
    const label = lookupValue.label || lookupValue.literal

    return (
      <div key={lookupValue.key} className="lookup-value col-md-auto px-0">
        <span key={lookupValue.key}>{label}</span>
        <a
          href={lookupValue.uri}
          aria-label={`Link to value ${lookupValue.uri}`}
          target="_new"
        >
          <span aria-hidden="true">
            <FontAwesomeIcon className="globe-icon" icon={faGlobe} />
          </span>
        </a>
        <button
          onClick={() => props.removeValue(lookupValue.key)}
          data-testid={`Remove ${label}`}
          aria-label={`Remove ${label}`}
        >
          <FontAwesomeIcon className="trash-icon" icon={faTrashAlt} />
        </button>
      </div>
    )
  })

  const inputId = `lookup-input-${props.property.key}`
  return (
    <React.Fragment>
      <div className="form-inline" style={{ marginBottom: "5px" }}>
        <div className="input-group" onBlur={handleBlurDiacritics} id={id}>
          <input
            id={inputId}
            type="text"
            className={controlClasses.join(" ")}
            onChange={handleChangeDiacritics}
            onKeyDown={handleKeyDown}
            placeholder="Enter lookup query"
            disabled={isDisabled}
            value={currentContent}
            onClick={handleClickDiacritics}
            ref={inputLookupRef}
          />
          <div className="input-group-append" tabIndex="0">
            <button
              className="btn btn-outline-primary"
              disabled={isDisabled}
              aria-label={`Select diacritics for ${props.propertyTemplate.label}`}
              data-testid={`Select diacritics for ${props.propertyTemplate.label}`}
              onClick={toggleDiacritics}
            >
              &auml;
            </button>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            title="Submit lookup"
            onClick={handleSubmit}
            disabled={isDisabled}
            style={{ marginLeft: "5px" }}
            aria-label={`Submit lookup for ${props.propertyTemplate.label}`}
            data-testid={`Submit lookup for ${props.propertyTemplate.label}`}
          >
            Lookup
          </button>
        </div>
      </div>
      {error && <span className="invalid-feedback">{error}</span>}
      <div className="row">{lookupSelection}</div>
      <div className="row">
        <DiacriticsSelection
          id={diacriticsId}
          handleAddCharacter={handleAddCharacter}
          closeDiacritics={closeDiacritics}
          showDiacritics={showDiacritics}
        />
      </div>
      <ResourceList property={props.property} />
      <div className="row">
        <Lookup
          property={props.property}
          propertyTemplate={props.propertyTemplate}
          show={showLookup}
          hideLookup={hideLookup}
          onSelectionChanged={onSelectionChanged}
          query={query}
        />
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

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ removeValue }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLookup)
