// Copyright 2020 Stanford University see LICENSE for license

import React, { useState, useMemo } from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import RDFDisplay from "./RDFDisplay"
import { selectFullSubject } from "selectors/resources"
import GraphBuilder from "GraphBuilder"
import PanelResource from "../property/PanelResource"

const ResourceDisplay = ({ resourceKey, defaultFormat = "form" }) => {
  const resource = useSelector((state) => selectFullSubject(state, resourceKey))
  const dataset = useMemo(() => new GraphBuilder(resource).graph, [resource])
  const [format, setFormat] = useState(defaultFormat)

  const onChangeFormat = (event) => {
    setFormat(event.target.value)
    event.preventDefault()
  }

  return (
    <React.Fragment>
      <div className="row mb-3">
        <label htmlFor="format" className="col-form-label col-sm-1">
          Format:{" "}
        </label>
        <div className="col-sm-3">
          <select
            className="form-select"
            id="format"
            aria-label="Format Selection"
            onBlur={onChangeFormat}
            onChange={onChangeFormat}
            value={format}
          >
            <option value="form">Form view</option>
            <option value="jsonld">JSON-LD</option>
            <option value="n-triples">N-Triples</option>
            <option value="table">Table (RDF)</option>
            <option value="turtle">Turtle</option>
          </select>
        </div>
      </div>
      {format === "form" ? (
        <PanelResource resource={resource} readOnly={true} />
      ) : (
        <RDFDisplay dataset={dataset} format={format} />
      )}
    </React.Fragment>
  )
}

ResourceDisplay.propTypes = {
  resourceKey: PropTypes.string.isRequired,
  defaultFormat: PropTypes.string,
}

export default ResourceDisplay
