// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import PropertyLabel from "./PropertyLabel"
import PropertyLabelInfo from "./PropertyLabelInfo"
import PropertyComponent from "./PropertyComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { bindActionCreators } from "redux"
import { connect, useSelector } from "react-redux"
import { resourceEditErrorKey } from "../Editor"
import { expandProperty, contractProperty } from "actionCreators/resources"
import {
  selectNormProperty,
  selectCurrentResourceKey,
  selectCurrentResourceIsReadOnly,
} from "selectors/resources"
import { selectPropertyTemplate } from "selectors/templates"
import useNavigableComponent from "hooks/useNavigableComponent"
import { nanoid } from "nanoid"
import _ from "lodash"

const PanelProperty = (props) => {
  // Null values indicates that can be added.
  const isAdd = !props.property.valueKeys
  const isRequired = props.propertyTemplate.required
  const nbsp = "\u00A0"
  const trashIcon = faTrashAlt
  const [navEl, navClickHandler] = useNavigableComponent(
    props.resourceKey,
    props.propertyKey,
    props.propertyKey
  )
  const readOnly = useSelector((state) =>
    selectCurrentResourceIsReadOnly(state)
  )
  const isTemplate = props.isTemplate
  const cardClassName = ["card"]

  if (isTemplate) {
    cardClassName.push("template")
  }

  // used to associate the PropertyComponent field to be labeled with the PropertyLabel
  const propertyLabelId = `labelled-by-${nanoid()}`

  // On preview, don't display empty properties.
  if (readOnly && _.isEmpty(props.property.descUriOrLiteralValueKeys))
    return null

  // onClick is to support left navigation, so ignoring jsx-ally seems reasonable.
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div ref={navEl} onClick={navClickHandler}>
      <div
        className={cardClassName.join(" ")}
        data-testid={cardClassName[1]}
        data-label={props.propertyTemplate.label}
        style={{ marginBottom: "1em" }}
      >
        <div className="card-header prop-heading">
          <h5 className="card-title">
            <PropertyLabel
              forId={propertyLabelId}
              propertyTemplate={props.propertyTemplate}
            />
            <PropertyLabelInfo propertyTemplate={props.propertyTemplate} />
            {nbsp}
            {isAdd && !readOnly && (
              <button
                type="button"
                className="btn btn-sm btn-add btn-add-instance pull-right"
                onClick={() =>
                  props.expandProperty(
                    props.property.key,
                    resourceEditErrorKey(props.resourceKey)
                  )
                }
                aria-label={`Add ${props.propertyTemplate.label}`}
                data-testid={`Add ${props.propertyTemplate.label}`}
                data-id={props.property.key}
              >
                + Add
              </button>
            )}
            {!isAdd && !isRequired && !readOnly && (
              <button
                type="button"
                className="btn btn-sm btn-remove pull-right"
                aria-label={`Remove ${props.propertyTemplate.label}`}
                data-testid={`Remove ${props.propertyTemplate.label}`}
                onClick={() => props.contractProperty(props.property.key)}
                data-id={props.id}
              >
                <FontAwesomeIcon
                  className="fa-inverse trash-icon"
                  icon={trashIcon}
                />
              </button>
            )}
          </h5>
        </div>
        {!isAdd && (
          <div className="card-body panel-property">
            <PropertyComponent
              property={props.property}
              propertyTemplate={props.propertyTemplate}
            />
          </div>
        )}
      </div>
    </div>
  )
}

PanelProperty.propTypes = {
  float: PropTypes.number,
  id: PropTypes.string,
  property: PropTypes.object,
  propertyTemplate: PropTypes.object,
  propertyKey: PropTypes.string.isRequired,
  expandProperty: PropTypes.func,
  contractProperty: PropTypes.func,
  resourceKey: PropTypes.string.isRequired,
  isTemplate: PropTypes.bool,
}

const mapStateToProps = (state, ourProps) => {
  const property = selectNormProperty(state, ourProps.propertyKey)
  return {
    property,
    propertyTemplate: selectPropertyTemplate(
      state,
      property?.propertyTemplateKey
    ),
    resourceKey: selectCurrentResourceKey(state),
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ expandProperty, contractProperty }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PanelProperty)
