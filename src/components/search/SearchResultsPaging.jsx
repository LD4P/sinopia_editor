// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Config from 'Config'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import Pagination from 'react-bootstrap/lib/Pagination'
import { fetchSinopiaSearchResults } from 'actionCreators/search'

const SearchResultsPaging = (props) => {
  const [currentPage, setCurrentPage] = useState(1) // initialize currentPage to 1

  // If there are no results, we don't need paging
  if (props.totalResults === 0) {
    return null
  }

  // If there are fewer results than one full page, we don't need paging
  if (props.totalResults <= Config.searchResultsPerPage) {
    return null
  }

  /* Event.target.text is the page number clicked on
   * or:
   *   « - first
   *    ‹ - previous
   *    › - next
   *   » - last
   */
  const handleClick = (event) => {
    let queryFrom = 0
    let newCurrentPage = 1
    switch (event.target.text) {
      case '«':
        break
      case '‹':
        newCurrentPage = currentPage - 1
        break
      case '›':
        newCurrentPage = currentPage + 1
        break
      case '»':
        newCurrentPage = Math.ceil(props.totalResults / Config.searchResultsPerPage)
        break
      case undefined: // this is required to capture clicks on disabled buttons
        return
      default:
        newCurrentPage = Number(event.target.text)
        break
    }
    queryFrom = (newCurrentPage - 1) * Config.searchResultsPerPage
    setCurrentPage(newCurrentPage)
    props.fetchSinopiaSearchResults(props.queryString, queryFrom)
  }

  const lastPage = () => Math.ceil(props.totalResults / Config.searchResultsPerPage)
  const pageButton = (key, active) => <Pagination.Item key={ key } active={ active }>{key}</Pagination.Item>
  const pageButtons = () => Array.from({ length: lastPage() }, (_, index) => pageButton(index + 1, index + 1 === currentPage))

  return (
    <div id="search-results-pages" className="row">
      <div className="col-sm-2"></div>
      <div className="col-sm-8 text-center">
        <Pagination size="lg" onClick={handleClick}>
          <Pagination.First disabled={(currentPage === 1)} />
          <Pagination.Prev disabled={currentPage === 1} />
          {pageButtons()}
          <Pagination.Next disabled={currentPage === lastPage()} />
          <Pagination.Last disabled={currentPage === lastPage()} />
        </Pagination>
      </div>
      <div className="col-sm-2"></div>
    </div>
  )
}

SearchResultsPaging.propTypes = {
  totalResults: PropTypes.number,
  queryString: PropTypes.string,
  fetchSinopiaSearchResults: PropTypes.func,
}

const mapStateToProps = state => ({
  totalResults: state.selectorReducer.search.totalResults,
  queryString: state.selectorReducer.search.query,
})

const mapDispatchToProps = dispatch => bindActionCreators({ fetchSinopiaSearchResults }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsPaging)
