// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import NestedProperty from "./NestedProperty"
import NestedResourceActionButtons from "./NestedResourceActionButtons"
import { selectNormValue, selectNormSubject } from "selectors/resources"
import {
  selectSubjectTemplate,
  selectPropertyTemplateForProperty,
} from "selectors/templates"
import useNavTarget from "hooks/useNavTarget"
import ValuePropertyURI from "./ValuePropertyURI"
import ResourceClass from "./ResourceClass"
import _ from "lodash"

// AKA a value subject.
const NestedResource = ({ valueKey, readOnly }) => {
  const value = useSelector((state) => selectNormValue(state, valueKey))
  const valueSubject = useSelector((state) =>
    selectNormSubject(state, value?.valueSubjectKey)
  )
  const subjectTemplate = useSelector((state) =>
    selectSubjectTemplate(state, valueSubject?.subjectTemplateKey)
  )
  const propertyTemplate = useSelector((state) =>
    selectPropertyTemplateForProperty(state, value.propertyKey)
  )

  const { handleNavTargetClick, navTargetId } = useNavTarget(valueSubject)

  // On the preview page, don't show this nested resource if no values are present
  if (readOnly && _.isEmpty(valueSubject.descUriOrLiteralValueKeys)) return null

  // onClick is to support left navigation, so ignoring jsx-ally seems reasonable.
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div
      className="nested-resource"
      data-testid={`${subjectTemplate.label} nestedResource`}
      onClick={handleNavTargetClick}
      id={navTargetId}
    >
      <div className="row" key={valueKey}>
        <section className="col-md-6">
          <h5>{subjectTemplate.label}</h5>
        </section>
        <section className="col-md-6">
          {!readOnly && <NestedResourceActionButtons value={value} />}
        </section>
      </div>
      <div className="row">
        <div className="col">
          <ValuePropertyURI
            propertyTemplate={propertyTemplate}
            value={value}
            readOnly={readOnly}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ResourceClass readOnly={readOnly} resource={valueSubject} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          {valueSubject.propertyKeys.map((propertyKey) => (
            <NestedProperty
              key={propertyKey}
              propertyKey={propertyKey}
              readOnly={readOnly}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

NestedResource.propTypes = {
  valueKey: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default NestedResource
