import React from "react"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types"

const PropertyURI = ({
  propertyTemplate,
  obj,
  changePropertyUri,
  readOnly,
}) => {
  const dispatch = useDispatch()

  const propertyUriLabel = (uri) => {
    const label = propertyTemplate.uris[uri]
    return uri === label ? uri : `${label} (${uri})`
  }

  if (Object.keys(propertyTemplate.uris).length === 1 || readOnly) {
    return (
      <span className="property-uri">{propertyUriLabel(obj.propertyUri)}</span>
    )
  }

  const options = Object.keys(propertyTemplate.uris).map((uri) => (
    <option key={uri} value={uri}>
      {propertyUriLabel(uri)}
    </option>
  ))

  const handleChange = (event) => {
    event.preventDefault()
    if (event.target.value !== obj.propertyUri) {
      dispatch(changePropertyUri(obj.key, event.target.value))
    }
  }

  return (
    <div className="row mb-2">
      <label
        htmlFor={`property-select-${obj.key}`}
        className="col-sm-1 col-form-label"
      >
        Property
      </label>
      <div className="col-auto">
        <select
          className="form-select"
          id={`property-select-${obj.key}`}
          aria-label={`Select property for ${propertyTemplate.label}`}
          data-testid={`Select property for ${propertyTemplate.label}`}
          value={obj.propertyUri}
          onChange={handleChange}
          onBlur={handleChange}
        >
          {options}
        </select>
      </div>
    </div>
  )
}

PropertyURI.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
  obj: PropTypes.object.isRequired,
  readOnly: PropTypes.bool.isRequired,
  changePropertyUri: PropTypes.func.isRequired,
}

export default PropertyURI
