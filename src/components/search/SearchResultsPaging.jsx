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
  const [currentPage, setCurrentPage] = useState(1) // initialize currentPage at 1

  /* Event.target.text is the page number clicked on
   * or:
   *   « - first
   *    ‹ - previous
   *    › - next
   *   » - last
   */
  const handleClick = (event) => {
    let queryFrom = 0
    switch (event.target.text) {
      case '«':
          queryFrom = 0
          setCurrentPage(1)
          break
      case '‹':
          const prevPage = currentPage - 1 // decrease the current page by 1
          setCurrentPage(prevPage)
          queryFrom = (prevPage-1)*Config.searchResultsPerPage
          break
      case '›':
          const nextPage = Number(currentPage) + 1 // increase the current page by 1
          setCurrentPage(nextPage)
          queryFrom = (currentPage)*Config.searchResultsPerPage
          break
      case '»':
        const lastPage = props.totalResults / Config.searchResultsPerPage
        setCurrentPage(lastPage)
        queryFrom = (Number(lastPage)-1)*Config.searchResultsPerPage
        break
      default:
        setCurrentPage(Number(event.target.text))
        queryFrom = (Number(event.target.text)-1)*Config.searchResultsPerPage
        break
    }
    search(props.queryString, queryFrom)
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

  const lastPage = () => props.totalResults / Config.searchResultsPerPage

  const pageButton = (key, active) => <Pagination.Item key={key} active={active}>{key}</Pagination.Item>
  const pageButtons = () => Array.from({length: lastPage()}, (_, index) => pageButton(index+1,index+1 === currentPage))

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
        <div>Displaying 1 - 1 of 1 Results</div>
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
