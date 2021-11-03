import React from "react"
import PropTypes from "prop-types"
import { setValuePropertyURI } from "actions/resources"
import PropertyURI from "./PropertyURI"

const ValuePropertyURI = ({ propertyTemplate, value, readOnly = false }) => {
  if (propertyTemplate.ordered) return null

  return (
    <PropertyURI
      propertyTemplate={propertyTemplate}
      obj={value}
      changePropertyUri={setValuePropertyURI}
      readOnly={readOnly}
    />
  )
}

ValuePropertyURI.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
}

export default ValuePropertyURI
