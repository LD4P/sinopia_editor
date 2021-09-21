// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import InputLiteral from "./InputLiteral"
import InputURI from "./InputURI"
import InputList from "./InputList"
import InputLookup from "./InputLookup"
import NestedResource from "./NestedResource"
import Alert from "../../Alert"

// Decides how to render this property.
const PropertyComponent = (props) => {
  // Might be tempted to use lazy / suspense here, but it forces a remounting of components.
  switch (props.propertyTemplate.component) {
    case "NestedResource":
      return props.property.valueKeys.map((valueKey) => (
        <NestedResource key={valueKey} valueKey={valueKey} />
      ))
    case "InputLiteral":
      return (
        <InputLiteral
          propertyLabelId={props.propertyLabelId}
          property={props.property}
          propertyTemplate={props.propertyTemplate}
        />
      )
    case "InputURI":
      return (
        <InputURI
          property={props.property}
          propertyTemplate={props.propertyTemplate}
        />
      )
    case "InputLookup":
      return (
        <InputLookup
          property={props.property}
          propertyTemplate={props.propertyTemplate}
        />
      )
    case "InputList":
      return (
        <InputList
          propertyLabelId={props.propertyLabelId}
          property={props.property}
          propertyTemplate={props.propertyTemplate}
        />
      )
    default:
      return <Alert text="No component." />
  }
}

PropertyComponent.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  propertyLabelId: PropTypes.string.isRequired,
}

export default PropertyComponent
