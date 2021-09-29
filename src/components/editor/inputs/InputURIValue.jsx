import React, { useRef, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import TextareaAutosize from "react-textarea-autosize"
import {
  updateURIValue as updateURIValueAction,
  removeValue,
} from "actions/resources"
import LanguageButton from "./LanguageButton"
import DiacriticsButton from "./DiacriticsButton"
import DiacriticsSelection from "components/editor/diacritics/DiacriticsSelection"
import useDiacritics from "hooks/useDiacritics"
import { isHttp } from "utilities/Utilities"
import RemoveButton from "./RemoveButton"
import _ from "lodash"

const InputURIValue = ({
  value,
  propertyTemplate,
  displayValidations,
  shouldFocus,
}) => {
  const dispatch = useDispatch()
  const inputURIRef = useRef(null)
  const inputLabelRef = useRef(null)
  const [focusHasBeenSet, setFocusHasBeenSet] = useState(false)
  const [currentURIContent, setCurrentURIContent] = useState(value.uri || "")
  const [showLink, setShowLink] = useState(isHttp(value.uri))
  const uriId = `inputuri-${value.key}`
  const labelId = `inputuri-label-${value.key}`
  const diacriticsId = `diacritics-${value.key}`
  const diacriticsBtnId = `diacritics-btn-${value.key}`
  const {
    showDiacritics,
    toggleDiacritics,
    closeDiacritics,
    handleBlurDiacritics,
    currentContent: currentLabelContent,
    handleChangeDiacritics,
    handleKeyDownDiacritics,
    handleAddCharacter,
    handleClickDiacritics,
  } = useDiacritics(
    inputLabelRef,
    labelId,
    diacriticsId,
    diacriticsBtnId,
    value.label || ""
  )
  const updateURIValue = () => {
    setShowLink(isHttp(currentURIContent))
    dispatch(
      updateURIValueAction(
        value.key,
        currentURIContent,
        currentLabelContent,
        value.lang
      )
    )
  }

  useEffect(() => {
    if (value.literal === "" && !focusHasBeenSet && shouldFocus) {
      inputURIRef.current.focus()
      setFocusHasBeenSet(true)
    }
  }, [focusHasBeenSet, shouldFocus, value.literal])

  const handleLabelBlur = (event) => {
    if (handleBlurDiacritics(event)) {
      updateURIValue()
      event.preventDefault()
    }
  }

  const handleRemoveClick = (event) => {
    dispatch(removeValue(value.key))
    event.preventDefault()
  }

  const handleURIBlur = (event) => {
    updateURIValue()
    event.preventDefault()
  }

  const handleURIKeyDown = (event) => {
    if (event.key === "Enter") {
      updateURIValue()
      event.preventDefault()
    }
  }

  const handleLabelKeyDown = (event) => {
    if (event.key === "Enter") {
      updateURIValue()
      event.preventDefault()
    }
    // Handle any position changing
    handleKeyDownDiacritics(event)
  }

  const handleChangeURI = (event) => {
    setCurrentURIContent(event.target.value)
    event.preventDefault()
  }

  const uriControlClasses = ["form-control"]
  const uriErrors = value.errors.filter((error) => error !== "Label required")
  if (displayValidations && !_.isEmpty(uriErrors))
    uriControlClasses.push("is-invalid")

  const labelControlClasses = ["form-control"]
  const labelErrors = value.errors.filter((error) => error === "Label required")
  if (displayValidations && !_.isEmpty(labelErrors))
    labelControlClasses.push("is-invalid")

  return (
    <React.Fragment>
      <div className="row my-2">
        <div className="col">
          <label htmlFor={uriId} className="form-label">
            URI
          </label>
          <TextareaAutosize
            required={propertyTemplate.required}
            className={uriControlClasses.join(" ")}
            placeholder={propertyTemplate.label}
            aria-label={propertyTemplate.label}
            onChange={handleChangeURI}
            onKeyDown={handleURIKeyDown}
            onBlur={handleURIBlur}
            value={currentURIContent}
            ref={inputURIRef}
            id={uriId}
          />
          <div
            className="invalid-feedback"
            data-testid={`URI errors for ${currentLabelContent}`}
          >
            {uriErrors.join(", ")}
          </div>
        </div>
        {showLink && (
          <div className="col-md-auto d-flex align-items-end pb-2 ps-0">
            <a
              href={currentURIContent}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Link to ${currentURIContent}`}
              data-testid={`Link to ${currentURIContent}`}
            >
              <FontAwesomeIcon
                className="info-icon  ms-0"
                icon={faExternalLinkAlt}
              />
            </a>
          </div>
        )}

        <div className="col">
          <label htmlFor={labelId} className="form-label">
            Label
          </label>
          <TextareaAutosize
            required={propertyTemplate.required}
            className={labelControlClasses.join(" ")}
            placeholder={`Label for ${propertyTemplate.label}`}
            aria-label={`Label for ${propertyTemplate.label}`}
            onChange={handleChangeDiacritics}
            onKeyDown={handleLabelKeyDown}
            onBlur={handleLabelBlur}
            onClick={handleClickDiacritics}
            value={currentLabelContent}
            ref={inputLabelRef}
            id={labelId}
          />
          <div
            className="invalid-feedback"
            data-testid={`Label errors for ${currentURIContent}`}
          >
            {labelErrors.join(", ")}
          </div>
        </div>
        <div className="col-md-auto d-flex align-items-end">
          <DiacriticsButton
            id={diacriticsBtnId}
            content={currentLabelContent}
            handleClick={toggleDiacritics}
            handleBlur={handleLabelBlur}
          />
          <LanguageButton value={value} />
        </div>
        <div className="col-sm-1 d-flex align-items-end">
          <RemoveButton
            content={currentURIContent}
            handleClick={handleRemoveClick}
          />
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
    </React.Fragment>
  )
}

InputURIValue.propTypes = {
  value: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  displayValidations: PropTypes.bool.isRequired,
  shouldFocus: PropTypes.bool.isRequired,
}

export default InputURIValue
