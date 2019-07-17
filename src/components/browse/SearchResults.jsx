// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SearchResultsTable from './SearchResultsTable'

const SearchResults = (props) => {
  if (props.searchResults === undefined) {
    return null
  }

  return (
    <div id="search-results">
      <SearchResultsTable
        resultsCount={ props.searchResults.hits.total }
        searchResults={ props.searchResults.hits.hits} />
    </div>
  )
}

SearchResults.propTypes = {
  searchResults: PropTypes.object,
}

const mapStateToProps = state => ({
  searchResults: state.selectorReducer.search.results,
})

export default connect(mapStateToProps, null)(SearchResults)
