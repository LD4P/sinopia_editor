import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import { selectProperty } from "selectors/resources"
import { isHttp } from "utilities/Utilities"

const ReadOnlyInputURI = ({ propertyKey }) => {
  const property = useSelector((state) => selectProperty(state, propertyKey))

  const inputValues = property.values.map((value) => {
    const uri = isHttp(value.uri) ? (
      <a target="_blank" rel="noopener noreferrer" href={value.uri}>
        {value.uri}
      </a>
    ) : (
      value.uri
    )
    if (value.label) {
      const langLabel = value.langLabel ? ` [${value.langLabel}]` : ""
      return (
        <p key={value.key}>
          {value.label}
          {langLabel}: {uri}
        </p>
      )
    }
    return <p key={value.key}>{uri}</p>
  })

  return <React.Fragment>{inputValues}</React.Fragment>
}

ReadOnlyInputURI.propTypes = {
  propertyKey: PropTypes.string.isRequired,
}

export default ReadOnlyInputURI
