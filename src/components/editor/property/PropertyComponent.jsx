// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import InputLiteralOrURI from "../inputs/InputLiteralOrURI"
import InputList from "./InputList"
import InputLookup from "./InputLookup"
import NestedResource from "./NestedResource"
import ReadOnlyInputLiteral from "../inputs/ReadOnlyInputLiteral"
import ReadOnlyInputURI from "../inputs/ReadOnlyInputURI"
import Alert from "../../Alert"
import { selectCurrentResourceIsReadOnly } from "selectors/resources"
import { displayResourceValidations } from "selectors/errors"

// Decides how to render this property.
const PropertyComponent = ({ property, propertyTemplate, propertyLabelId }) => {
  const readOnly = useSelector((state) =>
    selectCurrentResourceIsReadOnly(state)
  )
  const displayValidations = useSelector((state) =>
    displayResourceValidations(state, property.rootSubjectKey)
  )

  // Might be tempted to use lazy / suspense here, but it forces a remounting of components.
  switch (propertyTemplate.component) {
    case "NestedResource":
      return property.valueKeys.map((valueKey) => (
        <NestedResource key={valueKey} valueKey={valueKey} />
      ))
    case "InputLiteral":
      if (readOnly) {
        return <ReadOnlyInputLiteral propertyKey={property.key} />
      }
      return (
        <InputLiteralOrURI
          property={property}
          propertyTemplate={propertyTemplate}
          displayValidations={displayValidations}
        />
      )
    case "InputURI":
      if (readOnly) {
        return <ReadOnlyInputURI propertyKey={property.key} />
      }
      return (
        <InputLiteralOrURI
          property={property}
          propertyTemplate={propertyTemplate}
          displayValidations={displayValidations}
        />
      )
    case "InputLookup":
      return (
        <InputLookup property={property} propertyTemplate={propertyTemplate} />
      )
    case "InputList":
      return (
        <InputList
          propertyLabelId={propertyLabelId}
          property={property}
          propertyTemplate={propertyTemplate}
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
