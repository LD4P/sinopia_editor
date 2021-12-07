// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import ResourceTemplateSearchResult from "./ResourceTemplateSearchResult"
import _ from "lodash"

const ExpandingResourceTemplates = ({ results, id, label }) => {
  if (_.isEmpty(results)) return null

  return (
    <div className="card expanding-section" style={{ marginBottom: "20px" }}>
      <div className="card-header">
        <h3>
          <button
            className="btn btn-link collapse-heading collapsed"
            data-bs-toggle="collapse"
            data-bs-target={`#${id}`}
          >
            {label}
          </button>
        </h3>
      </div>
      <div id={id} className="collapse" style={{ padding: "5px" }}>
        <ResourceTemplateSearchResult results={results} />
      </div>
    </div>
  )
}

ExpandingResourceTemplates.propTypes = {
  results: PropTypes.array,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default ExpandingResourceTemplates
