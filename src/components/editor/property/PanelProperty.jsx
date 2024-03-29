// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import PropertyLabel from "./PropertyLabel"
import PropertyLabelInfo from "./PropertyLabelInfo"
import PropertyComponent from "./PropertyComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { expandProperty, contractProperty } from "actionCreators/resources"
import { selectNormProperty } from "selectors/resources"
import { selectPropertyTemplate } from "selectors/templates"
import useNavTarget from "hooks/useNavTarget"
import useAlerts from "hooks/useAlerts"
import _ from "lodash"
import PropertyPropertyURI from "./PropertyPropertyURI"

const PanelProperty = ({ propertyKey, readOnly, id, isTemplate }) => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()
  const property = useSelector((state) =>
    selectNormProperty(state, propertyKey)
  )
  const propertyTemplate = useSelector((state) =>
    selectPropertyTemplate(state, property?.propertyTemplateKey)
  )

  // Null values indicates that can be added.
  const isAdd = !property.valueKeys
  const isRequired = propertyTemplate.required
  const trashIcon = faTrashAlt
  const { handleNavTargetClick, navTargetId } = useNavTarget(property)

  const cardClassName = ["card", "container", "px-0"]

  if (isTemplate) {
    cardClassName.push("template")
  }

  // On preview, don't display empty properties.
  if (readOnly && _.isEmpty(property.descUriOrLiteralValueKeys)) return null

  // onClick is to support left navigation, so ignoring jsx-ally seems reasonable.
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div onClick={handleNavTargetClick} id={navTargetId}>
      <div
        className={cardClassName.join(" ")}
        data-testid={`${propertyTemplate.label} panelProperty`}
        data-label={propertyTemplate.label}
        style={{ marginBottom: "1em" }}
      >
        <div className="prop-heading row mx-0">
          <div className="col px-0">
            <h5>
              <PropertyLabel
                required={propertyTemplate.required}
                label={propertyTemplate.label}
              />
              <PropertyLabelInfo propertyTemplate={propertyTemplate} />
            </h5>
          </div>
          <div className="col">
            {isAdd && !readOnly && (
              <button
                type="button"
                className="btn btn-sm btn-add btn-link pull-right"
                onClick={() => dispatch(expandProperty(property.key, errorKey))}
                aria-label={`Add ${propertyTemplate.label}`}
                data-testid={`Add ${propertyTemplate.label}`}
                data-id={property.key}
              >
                + Add
              </button>
            )}
            {!isAdd && !isRequired && !readOnly && (
              <button
                type="button"
                className="btn btn-sm btn-remove pull-right"
                aria-label={`Remove ${propertyTemplate.label}`}
                data-testid={`Remove ${propertyTemplate.label}`}
                onClick={() => dispatch(contractProperty(property.key))}
                data-id={id}
              >
                <FontAwesomeIcon className="trash-icon" icon={trashIcon} />
              </button>
            )}
          </div>
        </div>
        {!isAdd && (
          <React.Fragment>
            <div className="prop-heading py-2">
              <PropertyPropertyURI
                propertyTemplate={propertyTemplate}
                property={property}
                readOnly={readOnly}
              />
            </div>
            <div className="panel-property">
              <PropertyComponent
                property={property}
                propertyTemplate={propertyTemplate}
                readOnly={readOnly}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

PanelProperty.propTypes = {
  id: PropTypes.string,
  propertyKey: PropTypes.string.isRequired,
  isTemplate: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
}

export default PanelProperty
