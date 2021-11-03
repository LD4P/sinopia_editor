import React from "react"
import PropTypes from "prop-types"
import { setPropertyPropertyURI } from "actions/resources"
import PropertyURI from "./PropertyURI"

const PropertyPropertyURI = ({
  propertyTemplate,
  property,
  readOnly = false,
}) => {
  if (!propertyTemplate.ordered) return null

  return (
    <PropertyURI
      propertyTemplate={propertyTemplate}
      obj={property}
      changePropertyUri={setPropertyPropertyURI}
      readOnly={readOnly}
    />
  )
}

PropertyPropertyURI.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
  property: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
}

export default PropertyPropertyURI
