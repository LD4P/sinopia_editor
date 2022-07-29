// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"

const SearchResultsPaging = (props) => {
  const currentPage = Math.ceil((props.startOfRange + 1) / props.resultsPerPage)

  const changePage = (event, page) => {
    event.preventDefault()
    props.changePage((page - 1) * props.resultsPerPage)
  }

  // If there are no results, we don't need paging
  if (!props.totalResults) {
    return null
  }

  // If there are fewer results than one full page, we don't need paging
  if (props.totalResults <= props.resultsPerPage) {
    return null
  }
  const lastPage = Math.ceil(props.totalResults / props.resultsPerPage)
  // eslint-disable-next-line max-params
  const pageButton = (key, label, page, active) => {
    const classes = ["page-item"]
    if (active) classes.push("active")
    if (page < 1 || page > lastPage) classes.push("disabled")
    return (
      <li key={key} className={classes.join(" ")}>
        <button
          className="page-link"
          aria-label={key}
          onClick={(event) => changePage(event, page)}
        >
          {label}
        </button>
      </li>
    )
  }

  const startPos = currentPage - 5 > 1 ? currentPage - 5 : 1
  const endPos = currentPage + 5 < lastPage ? currentPage + 5 : lastPage
  const range = Array.from(
    { length: endPos - startPos + 1 },
    (_, i) => startPos + i
  )
  if (range[0] === 1) range.shift()
  if (range.slice(-1)[0] === lastPage) range.pop()

  const elipsis = (
    <li
      className="page-item"
      style={{ borderStyle: "hidden", marginLeft: "1px", marginRight: "1px" }}
    >
      ...
    </li>
  )
  const startElipsis = startPos > 2 ? elipsis : ""
  const endElipsis = endPos < lastPage - 1 ? elipsis : ""
  const pageButtons = range.map((index) =>
    pageButton(index, index, index, index === currentPage)
  )

  return (
    <div id="search-results-pages" className="row">
      <div className="col">
        <nav aria-label="search results navigation">
          <ul className="pagination" data-testid="pagination">
            {pageButton("first", "«", 1, false)}
            {pageButton("previous", "‹", currentPage - 1, false)}
            {pageButton(1, 1, 1, currentPage === 1)}
            {startElipsis}
            {pageButtons}
            {endElipsis}
            {pageButton(lastPage, lastPage, lastPage, currentPage === lastPage)}
            {pageButton("next", "›", currentPage + 1, false)}
            {pageButton("last", "»", lastPage, false)}
          </ul>
        </nav>
      </div>
    </div>
  )
}

SearchResultsPaging.propTypes = {
  changePage: PropTypes.func.isRequired,
  totalResults: PropTypes.number.isRequired,
  resultsPerPage: PropTypes.number.isRequired,
  startOfRange: PropTypes.number.isRequired,
}

export default SearchResultsPaging
