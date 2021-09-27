import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types"
import _ from "lodash"
import InputLiteralValue from "./InputLiteralValue"
import { addValue } from "actions/resources"
import { newLiteralValue } from "utilities/valueFactory"
import { defaultLanguageId } from "utilities/Utilities"

const InputLiteral = ({ property, propertyTemplate, displayValidations }) => {
  const dispatch = useDispatch()

  const inputValues = property.valueKeys.map((valueKey) => (
    <InputLiteralValue
      key={valueKey}
      valueKey={valueKey}
      propertyTemplate={propertyTemplate}
      displayValidations={displayValidations}
      shouldFocus={property.valueKeys.length > 1}
    />
  ))
  const canAddAnother = propertyTemplate.repeatable

  useEffect(() => {
    if (_.isEmpty(property.valueKeys))
      dispatch(addValue(newLiteralValue(property, "", defaultLanguageId)))
  }, [property, dispatch])

  const handleAddAnotherClick = (event) => {
    dispatch(addValue(newLiteralValue(property, "", defaultLanguageId)))
    event.preventDefault()
  }

  return (
    <React.Fragment>
      {inputValues}
      {canAddAnother && (
        <button
          type="button"
          className="btn btn-outline-primary"
          aria-label={`Add another ${propertyTemplate.label}`}
          data-testid={`Add another ${propertyTemplate.label}`}
          onClick={handleAddAnotherClick}
        >
          + Add another
        </button>
      )}
    </React.Fragment>
  )
}

InputLiteral.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  displayValidations: PropTypes.bool.isRequired,
}

export default InputLiteral
