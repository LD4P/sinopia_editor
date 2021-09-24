import React from "react"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types"
import InputLiteralValue from "./InputLiteralValue"
import InputURIValue from "./InputURIValue"
import { addValue as addValueAction } from "actions/resources"
import { newBlankValue } from "utilities/valueFactory"

const InputLiteralOrURI = ({
  property,
  propertyTemplate,
  displayValidations,
}) => {
  const dispatch = useDispatch()
  const isLiteral = propertyTemplate.type === "literal"

  const inputValues = property.valueKeys.map((valueKey) => {
    const props = {
      valueKey,
      propertyTemplate,
      displayValidations,
      shouldFocus: property.valueKeys.length > 1,
    }
    return isLiteral ? (
      <InputLiteralValue key={valueKey} {...props} />
    ) : (
      <InputURIValue key={valueKey} {...props} />
    )
  })

  const canAddAnother = propertyTemplate.repeatable

  const handleAddAnotherClick = (event) => {
    dispatch(addValueAction(newBlankValue(property)))
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

InputLiteralOrURI.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  displayValidations: PropTypes.bool.isRequired,
}

export default InputLiteralOrURI
