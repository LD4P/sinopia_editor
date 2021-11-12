import React, { useRef, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import {
  updateLiteralValue,
  updateURIValue,
  removeValue,
} from "actions/resources"
import DiacriticsSelection from "components/editor/diacritics/DiacriticsSelection"
import useDiacritics from "hooks/useDiacritics"
import DiacriticsButton from "./DiacriticsButton"
import Lookup from "./Lookup"
import Config from "Config"
import ResourceList from "../property/ResourceList"
import RemoveButton from "./RemoveButton"
import ValuePropertyURI from "../property/ValuePropertyURI"
import _ from "lodash"

const InputLookupValue = ({
  value,
  propertyTemplate,
  displayValidations,
  shouldFocus,
}) => {
  const dispatch = useDispatch()
  const inputRef = useRef(null)
  const [focusHasBeenSet, setFocusHasBeenSet] = useState(false)
  const [showLookup, setShowLookup] = useState(false)
  // currentContent is what appears in the input. Query is sent to Lookup.
  const [query, setQuery] = useState("")
  const id = `inputlookup-${value.key}`
  const diacriticsId = `diacritics-${value.key}`
  const diacriticsBtnId = `diacritics-btn-${value.key}`
  const {
    showDiacritics,
    toggleDiacritics,
    closeDiacritics,
    handleBlurDiacritics,
    currentContent,
    handleChangeDiacritics,
    handleKeyDownDiacritics,
    handleAddCharacter,
    handleClickDiacritics,
  } = useDiacritics(inputRef, id, diacriticsId, diacriticsBtnId, "")

  useEffect(() => {
    if (value.literal === "" && !focusHasBeenSet && shouldFocus) {
      inputRef.current.focus()
      setFocusHasBeenSet(true)
    }
  }, [focusHasBeenSet, shouldFocus, value.literal])

  const handleRemoveClick = (event) => {
    dispatch(removeValue(value.key))
    event.preventDefault()
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      lookup()
      event.preventDefault()
    }
    // Handle any position changing
    handleKeyDownDiacritics(event)
  }

  const handleLookupClick = (event) => {
    lookup()
    event.preventDefault()
  }

  const hideLookup = (event) => {
    if (event) event.preventDefault()
    setShowLookup(false)
  }

  const handleOwnUriClick = (event) => {
    hideLookup()
    closeDiacritics()
    dispatch(
      updateURIValue(
        value.key,
        null,
        null,
        propertyTemplate.languageSuppressed ? null : Config.defaultLanguageId,
        "InputURIValue"
      )
    )
    event.preventDefault()
  }

  const lookup = () => {
    setShowLookup(true)
    closeDiacritics()
    setQuery(currentContent)
  }

  // These are passed down to Lookup components.
  const handleUpdateURI = (uri, label, lang) => {
    hideLookup()
    closeDiacritics()
    dispatch(updateURIValue(value.key, uri, label, lang, "InputURIValue"))
  }

  const handleUpdateLiteral = (literal) => {
    hideLookup()
    closeDiacritics()
    dispatch(
      updateLiteralValue(
        value.key,
        literal,
        propertyTemplate.languageSuppressed ? null : Config.defaultLanguageId,
        "InputLiteralValue"
      )
    )
  }

  const authorityLabels = propertyTemplate.authorities.map(
    (authority) => authority.label
  )

  const controlClasses = ["form-control"]
  if (displayValidations && !_.isEmpty(value.errors))
    controlClasses.push("is-invalid")

  return (
    <React.Fragment>
      <ValuePropertyURI propertyTemplate={propertyTemplate} value={value} />
      <div className="row my-2">
        <div className="col">
          <div className="form-label text-end">
            <button
              type="button"
              className="btn btn-link py-0 pe-0"
              onClick={handleOwnUriClick}
            >
              Enter your own URI and label
            </button>
          </div>
          <div className="input-group">
            <input
              type="text"
              className={controlClasses.join(" ")}
              placeholder={`Enter lookup query for ${propertyTemplate.label}`}
              aria-label={`Enter lookup query for ${propertyTemplate.label}`}
              onChange={handleChangeDiacritics}
              onKeyDown={handleKeyDown}
              onBlur={handleBlurDiacritics}
              onClick={handleClickDiacritics}
              value={currentContent}
              ref={inputRef}
              id={id}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={handleLookupClick}
              aria-label={`Submit lookup`}
              data-testid={`Submit lookup`}
            >
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <div className="invalid-feedback">{value.errors.join(", ")}</div>
          </div>
        </div>
        <div className="col-md-auto d-flex align-items-end">
          <DiacriticsButton
            id={diacriticsBtnId}
            content={currentContent}
            handleClick={toggleDiacritics}
            handleBlur={handleBlurDiacritics}
          />
        </div>
        <div className="col-sm-1 d-flex align-items-end">
          <RemoveButton
            content={currentContent}
            handleClick={handleRemoveClick}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-text mt-0 mb-2">
            Lookup with: {authorityLabels.join(", ")}
          </div>
        </div>
      </div>
      <div className="row">
        <DiacriticsSelection
          id={diacriticsId}
          handleAddCharacter={handleAddCharacter}
          closeDiacritics={closeDiacritics}
          showDiacritics={showDiacritics}
        />
      </div>
      <ResourceList property={value.property} />
      <div className="row">
        <Lookup
          property={value.property}
          propertyTemplate={propertyTemplate}
          show={showLookup}
          hideLookup={hideLookup}
          handleUpdateLiteral={handleUpdateLiteral}
          handleUpdateURI={handleUpdateURI}
          query={query}
        />
      </div>
    </React.Fragment>
  )
}

InputLookupValue.propTypes = {
  value: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  displayValidations: PropTypes.bool.isRequired,
  shouldFocus: PropTypes.bool.isRequired,
}

export default InputLookupValue
