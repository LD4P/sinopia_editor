// Copyright 2020 Stanford University see LICENSE for license

import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import RDFDisplay from "./RDFDisplay"
import { selectFullSubject } from "selectors/resources"
import { hasRelationships as hasRelationshipsSelector } from "selectors/relationships"
import GraphBuilder from "GraphBuilder"
import PanelResource from "../property/PanelResource"
import RelationshipsDisplay from "../leftNav/RelationshipsDisplay"
import useAlerts from "hooks/useAlerts"

const ResourceDisplay = ({
  resourceKey,
  defaultFormat = "form",
  displayRelationships = true,
}) => {
  const errorKey = useAlerts()
  const resource = useSelector((state) => selectFullSubject(state, resourceKey))
  const hasRelationships = useSelector((state) =>
    hasRelationshipsSelector(state, resourceKey)
  )
  const dataset = useMemo(() => new GraphBuilder(resource).graph, [resource])
  const [format, setFormat] = useState(defaultFormat)

  const onChangeFormat = (event) => {
    setFormat(event.target.value)
    event.preventDefault()
  }

  let display = <RDFDisplay dataset={dataset} format={format} />
  if (format === "form")
    display = <PanelResource resource={resource} readOnly={true} />
  if (format === "relationships")
    display = (
      <RelationshipsDisplay
        resourceKey={resourceKey}
        errorKey={errorKey}
        displayActions={false}
      />
    )

  return (
    <React.Fragment>
      <div className="row mb-3">
        <label htmlFor="format" className="col-form-label col-sm-1">
          View:{" "}
        </label>
        <div className="col-sm-3">
          <select
            className="form-select"
            id="format"
            aria-label="Format Selection"
            data-testid="Format Selection"
            onBlur={onChangeFormat}
            onChange={onChangeFormat}
            value={format}
          >
            <option value="form">Form view</option>
            {displayRelationships && hasRelationships && (
              <option value="relationships">Relationships</option>
            )}
            <option value="jsonld">JSON-LD</option>
            <option value="n-triples">N-Triples</option>
            <option value="table">Table (RDF)</option>
            <option value="turtle">Turtle</option>
          </select>
        </div>
      </div>
      {display}
    </React.Fragment>
  )
}

ResourceDisplay.propTypes = {
  resourceKey: PropTypes.string.isRequired,
  defaultFormat: PropTypes.string,
  displayRelationships: PropTypes.bool,
}

export default ResourceDisplay
