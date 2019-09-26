// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Config from 'Config'

// Renders the search results message after a search
const SearchResultsMessage = (props) => {
  if (props.query === undefined) {
    return null
  }

  const lastItemOnPage = props.startOfRange + Config.searchResultsPerPage > props.totalResults
    ? props.totalResults
    : props.startOfRange + Config.searchResultsPerPage

  if (props.totalResults === 0) {
    return (
      <div id="search-results-message" className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-8 text-center">
          <div><strong>Displaying 0 Search Results</strong></div>
        </div>
      </div>
    )
  }

  return (
    <div id="search-results-message" className="row">
      <div className="col-sm-2"></div>
      <div className="col-sm-8 text-center">
        <div><strong>Displaying {props.startOfRange + 1} - {lastItemOnPage} of {props.totalResults}</strong></div>
      </div>
      <div className="col-sm-2"></div>
    </div>
  )
}

SearchResultsMessage.propTypes = {
  query: PropTypes.string,
  totalResults: PropTypes.number,
  startOfRange: PropTypes.number,
}

const mapStateToProps = state => ({
  query: state.selectorReducer.search.query,
  totalResults: state.selectorReducer.search.totalResults,
  startOfRange: state.selectorReducer.search.startOfRange,
})

export default connect(mapStateToProps, null)(SearchResultsMessage)
