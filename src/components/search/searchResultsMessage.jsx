// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// Renders the search results message after a search
const SearchResultsMessage = (props) => {

  if (props.query === undefined) {
    return null
  }

  if (props.totalResults === 0) {
    return (
      <div id="search-results-message" className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-8 text-center">
          <div><strong>Displaying 0 Results</strong></div>
        </div>
        <div className="col-sm-2"></div>
      </div>
    )
  } else {
    return (
      <div id="search-results-message" className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-8 text-center">
          <div>Displaying Results</div>
        </div>
        <div className="col-sm-2"></div>
      </div>
    )
  }
}

SearchResultsMessage.propTypes = {
  query: PropTypes.string,
  totalResults: PropTypes.number,
}

const mapStateToProps = state => ({
  query: state.selectorReducer.search.query,
  totalResults: state.selectorReducer.search.totalResults
})

export default connect(mapStateToProps, null)(SearchResultsMessage)
