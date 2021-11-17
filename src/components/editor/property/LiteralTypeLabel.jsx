import React from "react"
import PropTypes from "prop-types"

const LiteralTypeLabel = ({ propertyTemplate }) => {
  const labelText = (propertyTemplate) => {
    const typeLabelLookup = {
      "http://www.w3.org/2001/XMLSchema/integer": "integer",
      "http://www.w3.org/2001/XMLSchema/dateTime": "date time",
      "http://www.w3.org/2001/XMLSchema/dateTimeStamp":
        "date time with timezone",
    }

    let label = `Enter a ${
      typeLabelLookup[propertyTemplate.validationDataType] ?? "literal"
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
