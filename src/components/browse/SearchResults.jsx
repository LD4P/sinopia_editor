// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'


const SearchResults = (props) => {
  return (
    <div id="search-results">
      <div className="row">
        { props.searchResults !== undefined &&
          <h2>
            Search Results: { props.searchResults.hits.total }.
          </h2>
        }
      </div>
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

// searchResults.hits.hits