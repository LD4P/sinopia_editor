import React from "react"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import InputLiteralValue from "./InputLiteralValue"
import InputURIValue from "./InputURIValue"
import InputLookupValue from "./InputLookupValue"
import InputListValue from "./InputListValue"
import { addValue as addValueAction } from "actions/resources"
import {
  newBlankLiteralValue,
  newBlankUriValue,
  newBlankLookupValue,
  newBlankListValue,
} from "utilities/valueFactory"
import { selectProperty } from "selectors/resources"
import { selectDefaultLang } from "selectors/languages"

const InputLiteralOrURI = ({
  property,
  propertyTemplate,
  displayValidations,
}) => {
  const dispatch = useDispatch()
  const fullProperty = useSelector((state) =>
    selectProperty(state, property.key)
  )
  const defaultLang = useSelector((state) =>
    selectDefaultLang(state, property.rootSubjectKey)
  )

  const inputValues = fullProperty.values.map((value) => {
    const props = {
      value,
      propertyTemplate,
      displayValidations,
      shouldFocus: property.valueKeys.length > 1,
    }
    switch (value.component) {
      case "InputURIValue":
        return <InputURIValue key={value.key} {...props} />
      case "InputLookupValue":
        return <InputLookupValue key={value.key} {...props} />
      case "InputListValue":
        return <InputListValue key={value.key} {...props} />
      default:
        return <InputLiteralValue key={value.key} {...props} />
    }
  })

  const canAddAnother = propertyTemplate.repeatable

  const handleAddAnotherClick = (event) => {
    let newValue
    switch (propertyTemplate.component) {
      case "InputURI":
        newValue = newBlankUriValue(
          property,
          propertyTemplate.languageSuppressed,
          defaultLang,
          propertyTemplate.defaultUri
        )
        break
      case "InputLookup":
        newValue = newBlankLookupValue(property, propertyTemplate.defaultUri)
        break
      case "InputList":
        newValue = newBlankListValue(property, propertyTemplate.defaultUri)
        break
      default:
        newValue = newBlankLiteralValue(
          property,
          propertyTemplate.languageSuppressed,
          defaultLang,
          propertyTemplate.defaultUri
        )
    }
    dispatch(addValueAction(newValue))
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
          + Add another {propertyTemplate.label}
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
