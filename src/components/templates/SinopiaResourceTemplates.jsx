// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import ResourceTemplateSearchResult from "./ResourceTemplateSearchResult"
import { selectHistoricalTemplates } from "selectors/history"
import { selectSearchResults } from "selectors/search"
import ExpandingResourceTemplates from "./ExpandingResourceTemplates"
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

  return (
    <section id="resource-templates">
      <ExpandingResourceTemplates
        label="Most recently used templates"
        id="historicalTemplates"
        results={historicalTemplates}
      />
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
