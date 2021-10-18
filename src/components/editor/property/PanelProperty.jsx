// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import PropTypes from "prop-types"
import PropertyLabel from "./PropertyLabel"
import PropertyLabelInfo from "./PropertyLabelInfo"
import PropertyComponent from "./PropertyComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { resourceEditErrorKey } from "../Editor"
import { expandProperty, contractProperty } from "actionCreators/resources"
import { selectNormProperty } from "selectors/resources"
import { selectPropertyTemplate } from "selectors/templates"
import useNavigableComponent from "hooks/useNavigableComponent"
import { nanoid } from "nanoid"
import _ from "lodash"

const PanelProperty = ({
  propertyKey,
  resourceKey,
  readOnly,
  id,
  isTemplate,
}) => {
  const dispatch = useDispatch()
  const property = useSelector((state) =>
    selectNormProperty(state, propertyKey)
  )
  const propertyTemplate = useSelector((state) =>
    selectPropertyTemplate(state, property?.propertyTemplateKey)
  )

  // Null values indicates that can be added.
  const isAdd = !property.valueKeys
  const isRequired = propertyTemplate.required
  const nbsp = "\u00A0"
  const trashIcon = faTrashAlt
  const [navEl, navClickHandler] = useNavigableComponent(
    resourceKey,
    propertyKey,
    propertyKey
  )
  const cardClassName = ["card"]

  if (isTemplate) {
    cardClassName.push("template")
  }

  // used to associate the PropertyComponent field to be labeled with the PropertyLabel
  const propertyLabelId = `labelled-by-${nanoid()}`

  // On preview, don't display empty properties.
  if (readOnly && _.isEmpty(property.descUriOrLiteralValueKeys)) return null

  // onClick is to support left navigation, so ignoring jsx-ally seems reasonable.
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div ref={navEl} onClick={navClickHandler}>
      <div
        className={cardClassName.join(" ")}
        data-testid={cardClassName[1]}
        data-label={propertyTemplate.label}
        style={{ marginBottom: "1em" }}
      >
        <div className="prop-heading">
          <h5>
            <PropertyLabel
              forId={propertyLabelId}
              propertyTemplate={propertyTemplate}
            />
            <PropertyLabelInfo propertyTemplate={propertyTemplate} />
            {nbsp}
            {isAdd && !readOnly && (
              <button
                type="button"
                className="btn btn-sm btn-add btn-link pull-right"
                onClick={() =>
                  dispatch(
                    expandProperty(
                      property.key,
                      resourceEditErrorKey(resourceKey)
                    )
                  )
                }
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
          </h5>
        </div>
        {!isAdd && (
          <div className="panel-property">
            <PropertyComponent
              property={property}
              propertyTemplate={propertyTemplate}
              readOnly={readOnly}
            />
          </div>
        )}
      </div>
    </div>
  )
}

PanelProperty.propTypes = {
  id: PropTypes.string,
  propertyKey: PropTypes.string.isRequired,
  resourceKey: PropTypes.string.isRequired,
  isTemplate: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
}

export default PanelProperty
