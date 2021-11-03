// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import _ from "lodash"
import Alerts from "components/alerts/OldAlerts"
import ResourceTemplateSearchResult from "./ResourceTemplateSearchResult"
import { selectHistoricalTemplates } from "selectors/history"
import { selectSearchResults } from "selectors/search"

// Errors from loading a new resource from this page.
export const newResourceErrorKey = "newresource"

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
          <ResourceTemplateSearchResult
            results={historicalTemplates}
            errorKey={newResourceErrorKey}
          />
        </div>
      </div>
    )
  }

  return (
    <section id="resource-templates">
      <Alerts errorKey={newResourceErrorKey} />
      {history}
      {_.isEmpty(searchResults) ? (
        <div className="alert alert-warning" id="no-rt-warning">
          No resource templates match.
        </div>
      ) : (
        <ResourceTemplateSearchResult
          results={searchResults}
          errorKey={newResourceErrorKey}
        />
      )}
    </section>
  )
}

export default SinopiaResourceTemplates
