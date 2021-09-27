import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import { selectProperty } from "selectors/resources"

const ReadOnlyInputLiteral = ({ propertyKey }) => {
  const property = useSelector((state) => selectProperty(state, propertyKey))

  const inputValues = property.values.map((value) => {
    const language = value.langLabel || "No language specified"
    return (
      <p key={value.key}>
        {value.literal} [{language}]
      </p>
    )
  })

  return <React.Fragment>{inputValues}</React.Fragment>
}

ReadOnlyInputLiteral.propTypes = {
  propertyKey: PropTypes.string.isRequired,
}

export default ReadOnlyInputLiteral
