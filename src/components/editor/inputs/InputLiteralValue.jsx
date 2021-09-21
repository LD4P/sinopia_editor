import React, { useRef, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import TextareaAutosize from "react-textarea-autosize"
import { selectNormValue } from "selectors/resources"
import { updateLiteralValue, removeValue } from "actions/resources"
import LanguageButton from "./LanguageButton"
import DiacriticsSelection from "components/editor/diacritics/DiacriticsSelection"
import useDiacritics from "hooks/useDiacritics"
import _ from "lodash"

const InputLiteralValue = ({
  valueKey,
  propertyTemplate,
  displayValidations,
  shouldFocus,
}) => {
  const dispatch = useDispatch()
  const value = useSelector((state) => selectNormValue(state, valueKey))
  const inputLiteralRef = useRef(null)
  const [focusHasBeenSet, setFocusHasBeenSet] = useState(false)
  const id = `inputliteral-${valueKey}`
  const diacriticsId = `diacritics-${valueKey}`
  const diacriticsBtnId = `diacritics-btn-${valueKey}`
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
  } = useDiacritics(
    inputLiteralRef,
    id,
    diacriticsId,
    diacriticsBtnId,
    value.literal
  )

  useEffect(() => {
    if (value.literal === "" && !focusHasBeenSet && shouldFocus) {
      inputLiteralRef.current.focus()
      setFocusHasBeenSet(true)
    }
  }, [focusHasBeenSet, shouldFocus, value.literal])

  const handleBlur = (event) => {
    if (handleBlurDiacritics(event)) {
      dispatch(updateLiteralValue(valueKey, currentContent, value.lang))
      event.preventDefault()
    }
  }

  const handleRemoveClick = (event) => {
    dispatch(removeValue(valueKey))
    event.preventDefault()
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      dispatch(updateLiteralValue(valueKey, currentContent, value.lang))
      event.preventDefault()
    }
    // Handle any position changing
    handleKeyDownDiacritics(event)
  }

  const controlClasses = ["form-control"]
  if (displayValidations && !_.isEmpty(value.errors))
    controlClasses.push("is-invalid")

  return (
    <React.Fragment>
      <div className="row my-2">
        <div className="col">
          <TextareaAutosize
            required={propertyTemplate.required}
            className={controlClasses.join(" ")}
            placeholder={propertyTemplate.label}
            aria-label={propertyTemplate.label}
            onChange={handleChangeDiacritics}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onClick={handleClickDiacritics}
            value={currentContent}
            ref={inputLiteralRef}
            id={id}
          />
          <div className="invalid-feedback">{value.errors.join(", ")}</div>
        </div>
        <div className="col-md-auto">
          <button
            className="btn btn-link fs-4 py-0"
            id={diacriticsBtnId}
            aria-label={`Select diacritics for ${currentContent}`}
            data-testid={`Select diacritics for ${currentContent}`}
            onClick={toggleDiacritics}
            onBlur={handleBlur}
          >
            &auml;
          </button>
          <LanguageButton value={value} />
        </div>
        <div className="col-sm-1">
          <button
            type="button"
            className="btn btn-sm"
            aria-label={`Remove ${currentContent}`}
            data-testid={`Remove ${currentContent}`}
            onClick={handleRemoveClick}
          >
            <FontAwesomeIcon className="trash-icon" icon={faTrashAlt} />
          </button>
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

InputLiteralValue.propTypes = {
  valueKey: PropTypes.string.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  displayValidations: PropTypes.bool.isRequired,
  shouldFocus: PropTypes.bool.isRequired,
}

export default InputLiteralValue
