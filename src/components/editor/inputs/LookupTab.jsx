// Copyright 2020 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import RenderLookupContext from "./RenderLookupContext"
import _ from "lodash"
import SearchResultsPaging from "../../search/SearchResultsPaging"
import Config from "Config"

const LookupTab = (props) => {
  const query = props.query
  const authorityConfig = props.authorityConfig

  const handleChangePage = (newStartOfRange) => {
    props.handleChangePage(newStartOfRange, props.authorityConfig)
  }

  const handleSelectionChanged = (item) => {
    // Hardcoding to English. See https://github.com/LD4P/sinopia_editor/issues/3058
    props.handleUpdateURI(item.uri, item.label, "en")
  }

  if (_.isEmpty(query)) return null

  if (!props.result) {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Results Loading...</span>
      </div>
    )
  }

  if (props.result.error) {
    return <span className="text-danger">{props.result.error}</span>
  }

  if (!props.result.totalHits) {
    return <strong>No results</strong>
  }

  const tabResults = props.result.results.map((hit) => (
    <div key={hit.uri}>
      <button
        onClick={() => handleSelectionChanged(hit)}
        className="btn search-result"
      >
        {hit.context ? (
          <RenderLookupContext
            innerResult={hit}
            authLabel={authorityConfig.label}
            authURI={authorityConfig.uri}
          ></RenderLookupContext>
        ) : (
          hit.label
        )}
      </button>
    </div>
  ))

  // Not all authorities support paging
  const isPaging = props.result.results.length <= Config.maxRecordsForQALookups

  return (
    <React.Fragment>
      {tabResults}
      {isPaging && (
        <SearchResultsPaging
          key="search-paging"
          resultsPerPage={Config.maxRecordsForQALookups}
          startOfRange={props.result.options.startOfRange}
          totalResults={props.result.totalHits}
          changePage={handleChangePage}
        />
      )}
    </React.Fragment>
  )
}

LookupTab.propTypes = {
  authorityConfig: PropTypes.object.isRequired,
  query: PropTypes.string,
  handleUpdateURI: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  result: PropTypes.object,
}

export default LookupTab
