// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import InputLiteralOrURI from "../inputs/InputLiteralOrURI"
import NestedResource from "./NestedResource"
import ReadOnlyInputLiteralOrURI from "../inputs/ReadOnlyInputLiteralOrURI"
import Alert from "components/alerts/OldAlert"
import { displayResourceValidations } from "selectors/errors"
import { selectUri } from "selectors/resources"

// Decides how to render this property.
const PropertyComponent = ({ property, propertyTemplate, readOnly }) => {
  const uri = useSelector((state) => selectUri(state, property.rootSubjectKey))

  const displayValidations = useSelector((state) =>
    displayResourceValidations(state, property.rootSubjectKey)
  )

  // Immutable properties cannot be changed once saved.
  const immutable = propertyTemplate.immutable && uri

  // Might be tempted to use lazy / suspense here, but it forces a remounting of components.
  switch (propertyTemplate.component) {
    case "NestedResource":
      return property.valueKeys.map((valueKey) => (
        <NestedResource
          key={valueKey}
          valueKey={valueKey}
          readOnly={readOnly}
        />
      ))
    case "InputLiteral":
    case "InputURI":
    case "InputLookup":
    case "InputList":
      if (readOnly || immutable) {
        return <ReadOnlyInputLiteralOrURI propertyKey={property.key} />
      }
      return (
        <InputLiteralOrURI
          property={property}
          propertyTemplate={propertyTemplate}
          displayValidations={displayValidations}
        />
      )
    default:
      return <Alert text="No component." />
  }
}

PropertyComponent.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default PropertyComponent
