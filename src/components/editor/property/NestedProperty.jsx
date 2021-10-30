// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import NestedPropertyHeader from "./NestedPropertyHeader"
import PropertyComponent from "./PropertyComponent"
import { selectNormProperty } from "selectors/resources"
import { connect } from "react-redux"
import { nanoid } from "nanoid"
import useNavTarget from "hooks/useNavTarget"
import { selectPropertyTemplate } from "selectors/templates"

const NestedProperty = (props) => {
  const { handleNavTargetClick, navTargetId } = useNavTarget(props.property)
  const propertyLabelId = `labelled-by-${nanoid()}`

  // On the preview page, don't show this property if no values are present
  if (props.readOnly && !props.property.valueKeys) return null

  // onClick is to support left navigation, so ignoring jsx-ally seems reasonable.
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div
      onClick={handleNavTargetClick}
      id={navTargetId}
      className="rtOutline"
      data-label={props.propertyTemplate.label}
    >
      <NestedPropertyHeader
        id={propertyLabelId}
        property={props.property}
        propertyTemplate={props.propertyTemplate}
        readOnly={props.readOnly}
      />
      {props.property.valueKeys && props.property.show && (
        <div className="rOutline-property">
          <PropertyComponent
            property={props.property}
            propertyTemplate={props.propertyTemplate}
            readOnly={props.readOnly}
          />
        </div>
      )}
    </div>
  )
}

NestedProperty.propTypes = {
  propertyKey: PropTypes.string.isRequired,
  property: PropTypes.object,
  propertyTemplate: PropTypes.object,
  readOnly: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ourProps) => {
  const property = selectNormProperty(state, ourProps.propertyKey)
  return {
    property,
    propertyTemplate: selectPropertyTemplate(
      state,
      property?.propertyTemplateKey
    ),
  }
}

export default connect(mapStateToProps)(NestedProperty)
