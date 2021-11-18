import React from "react"
import PropTypes from "prop-types"

const LiteralTypeLabel = ({ propertyTemplate }) => {
  const labelText = (propertyTemplate) => {
    const typeLabelLookup = {
      "http://www.w3.org/2001/XMLSchema#integer": "an integer",
      "http://www.w3.org/2001/XMLSchema#dateTime": "a date time",
      "http://www.w3.org/2001/XMLSchema#dateTimeStamp":
        "a date time with timezone",
    }

    let label = `Enter ${
      typeLabelLookup[propertyTemplate.validationDataType] ?? "a literal"
    }`
    if (propertyTemplate.validationRegex) {
      label += ` in the form "${propertyTemplate.validationRegex}"`
    }

    return label
  }

  return (
    <div className="row">
      <div className="col">{labelText(propertyTemplate)}</div>
    </div>
  )
}

LiteralTypeLabel.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}

export default LiteralTypeLabel
