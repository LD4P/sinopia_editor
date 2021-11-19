import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import { selectProperty } from "selectors/resources"
import { isHttp } from "utilities/Utilities"
import _ from "lodash"

const ReadOnlyInputLiteralOrURI = ({ propertyKey }) => {
  const property = useSelector((state) => selectProperty(state, propertyKey))

  const filteredValues = property.values.filter(
    (value) => value.literal || value.uri
  )

  if (_.isEmpty(filteredValues)) return null

  const uriValue = (value) => {
    const uri = isHttp(value.uri) ? (
      <a target="_blank" rel="noopener noreferrer" href={value.uri}>
        {value.uri}
      </a>
    ) : (
      value.uri
    )
    if (value.label) {
      const langLabel = value.lang ? ` [${value.lang}]` : ""
      return (
        <p key={value.key}>
          {value.label}
          {langLabel}: {uri}
        </p>
      )
    }
    return <p key={value.key}>{uri}</p>
  }

  const literalValue = (value) => {
    const language = value.lang || "No language specified"
    return (
      <p key={value.key}>
        {value.literal} [{language}]
      </p>
    )
  }

  const inputValues = filteredValues.map((value) =>
    value.component === "InputLiteralValue"
      ? literalValue(value)
      : uriValue(value)
  )

  return <React.Fragment>{inputValues}</React.Fragment>
}

ReadOnlyInputLiteralOrURI.propTypes = {
  propertyKey: PropTypes.string.isRequired,
}

export default ReadOnlyInputLiteralOrURI
