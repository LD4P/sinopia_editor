// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Config from 'Config'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import { getCurrentUser } from 'authSelectors'
import Button from 'react-bootstrap/lib/Button'
import Pagination from 'react-bootstrap/lib/Pagination'
import { showSearchResults } from 'actions/index'


const SearchResultsPaging = (props) => {
  const [currentPage, setCurrentPage] = useState('')
  /* Event.target.text is the page number clicked on
   * or:
   *   « - first
   *    ‹ - previous
   *    › - next
   *   » - last
   */
  const handleClick = (event) => {
    switch (event.target.text) {
      case '«':
          search(props.queryString, 0) // Start from the beginning of the search results
          return
      case '‹':
          const prevPage = currentPage - 1 // decrease the current page by 1
          setCurrentPage(prevPage)
          search(props.queryString, (prevPage-1)*Config.searchResultsPerPage)
          return
      case '›':
          const nextPage = Number(currentPage) + 1 // increase the current page by 1
          setCurrentPage(nextPage)
          search(props.queryString, (currentPage)*Config.searchResultsPerPage)
          return
      case '»':
        const lastPage = props.totalResults / Config.searchResultsPerPage
        setCurrentPage(lastPage)
        search(props.queryString, (Number(lastPage)-1)*Config.searchResultsPerPage)
        return
      default:
        setCurrentPage(Number(event.target.text))
        search(props.queryString, (Number(event.target.text)-1)*Config.searchResultsPerPage)
        return
    }
  }

  if (props.totalResults === 0) {
    return null
  }

  if (props.totalResults <= Config.searchResultsPerPage) {
    return null
  }

  const responseToSearchResults = json => {
    return { totalHits: json.hits.total, results: json.hits.hits.map(row => ({ uri: row._id, title: row._source.title })) }
  }

  const search = (query, queryFrom) => {
    const uri = `${Config.searchHost}${Config.searchPath}?q=title:${query}%20OR%20subtitle:${query}&from=${queryFrom}&size=${Config.searchResultsPerPage}`
    fetch(uri)
      .then(resp => resp.json())
      .then(json => responseToSearchResults(json))
      .then((results) => {
        props.displaySearchResults(results.results, results.totalHits, query)
      })
  }

  let items = []
  items.push(
    <Pagination.First />,
    <Pagination.Prev />
  )

  for (let number = 1; number <= props.totalResults / Config.searchResultsPerPage; number++) {
    items.push(
      <Pagination.Item key={number}>
        {number}
      </Pagination.Item>,
    );
  }

  items.push(
    <Pagination.Next />,
    <Pagination.Last />
  )
  
  return (
    <div id="search-results-pages" className="row">
      <div className="col-sm-2"></div>
      <div className="col-sm-8 text-center">
        <Pagination size="lg" onClick={handleClick}>{items}</Pagination>
      </div>
      <div className="col-sm-2"></div>
    </div>
  )
}

SearchResultsPaging.propTypes = {
  totalResults: PropTypes.number,
  queryString: PropTypes.string,
  displaySearchResults: PropTypes.func,

}

const mapStateToProps = state => ({
  totalResults: state.selectorReducer.search.totalResults,
  queryString: state.selectorReducer.search.query,
})

const mapDispatchToProps = dispatch => ({
  displaySearchResults: (searchResults, totalResults, queryString) => {
    dispatch(showSearchResults(searchResults, totalResults, queryString))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchResultsPaging)
