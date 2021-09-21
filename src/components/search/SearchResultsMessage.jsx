// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import {
  selectSearchOptions,
  selectSearchQuery,
  selectSearchTotalResults,
} from "selectors/search"

// Renders the search results message after a search
const SearchResultsMessage = (props) => {
  if (props.query === undefined) {
    return null
  }

  const lastItemOnPage =
    props.startOfRange + props.resultsPerPage > props.totalResults
      ? props.totalResults
      : props.startOfRange + props.resultsPerPage

  if (props.totalResults === 0) {
    return (
      <div id="search-results-message" className="row">
        <div className="col">
          <div>
            <strong>Displaying 0 Search Results</strong>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="search-results-message" className="row">
      <div className="col">
        <div>
          <strong>
            Displaying {props.startOfRange + 1} - {lastItemOnPage} of{" "}
            {props.totalResults}
          </strong>
        </div>
      </div>
    </div>
  )
}

SearchResultsMessage.propTypes = {
  query: PropTypes.string,
  totalResults: PropTypes.number,
  startOfRange: PropTypes.number,
  resultsPerPage: PropTypes.number,
}

const mapStateToProps = (state) => {
  const options = selectSearchOptions(state, "resource")
  return {
    query: selectSearchQuery(state, "resource"),
    totalResults: selectSearchTotalResults(state, "resource"),
    startOfRange: options.startOfRange,
    resultsPerPage: options.resultsPerPage,
  }
}

export default connect(mapStateToProps, null)(SearchResultsMessage)
