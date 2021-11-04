// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import ResourceTemplateSearchResult from "./ResourceTemplateSearchResult"
import { selectHistoricalTemplates } from "selectors/history"
import { selectSearchResults } from "selectors/search"
import _ from "lodash"

/**
 * This is the list view of all the templates
 */
const SinopiaResourceTemplates = () => {
  const searchResults = useSelector((state) =>
    selectSearchResults(state, "template")
  )
  const historicalTemplates = useSelector((state) =>
    selectHistoricalTemplates(state)
  )

  let history
  if (!_.isEmpty(historicalTemplates)) {
    history = (
      <div className="card expanding-section" style={{ marginBottom: "20px" }}>
        <div className="card-header">
          <h3>
            <button
              className="btn btn-link collapse-heading collapsed"
              data-bs-toggle="collapse"
              data-bs-target="#historicalTemplates"
            >
              Most recently used templates
            </button>
          </h3>
        </div>
        <div
          id="historicalTemplates"
          className="collapse"
          style={{ padding: "5px" }}
        >
          <ResourceTemplateSearchResult results={historicalTemplates} />
        </div>
      </div>
    )
  }

  return (
    <section id="resource-templates">
      {history}
      {_.isEmpty(searchResults) ? (
        <div className="alert alert-warning" id="no-rt-warning">
          No resource templates match.
        </div>
      ) : (
        <ResourceTemplateSearchResult results={searchResults} />
      )}
    </section>
  )
}

export default SinopiaResourceTemplates
