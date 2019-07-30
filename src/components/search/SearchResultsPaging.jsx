// Copyright 2019 Stanford University see LICENSE for license
/* eslint no-unused-vars: 0 */ // --> OFF
/* eslint max-params: ["error", 4] */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Config from 'Config'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import { getCurrentUser } from 'authSelectors'
import Button from 'react-bootstrap/lib/Button'
import Pagination from 'react-bootstrap/lib/Pagination'


const SearchResultsPaging = (props) => {
  /* Event.target.text is the page number clicked on
   * or:
   *   << - first
   *    < - previous
   *    > - next
   *   >> - last
   */
  const handleClick = (event) => alert(event.target.text) 

  if (props.totalResults === 0) {
    return null
  }

  // for (let number = 1; number <= 5; number++) {
  //   items.push(
  //     <Pagination.Item key={number} active={number === active}>
  //       {number}
  //     </Pagination.Item>,
  //   );
  // }
  
  return (
    <div id="search-results-pages" className="row">
      <div className="col-sm-2"></div>
      <div className="col-sm-8 text-center">
        <Pagination size="lg" onClick={handleClick}>
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item>{1}</Pagination.Item>
          <Pagination.Ellipsis />

          <Pagination.Item>{10}</Pagination.Item>
          <Pagination.Item>{11}</Pagination.Item>
          <Pagination.Item>{12}</Pagination.Item>
          <Pagination.Item>{13}</Pagination.Item>
          <Pagination.Item>{14}</Pagination.Item>

          <Pagination.Ellipsis />
          <Pagination.Item>{20}</Pagination.Item>
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </div>
      <div className="col-sm-2"></div>
    </div>
  )
}

SearchResultsPaging.propTypes = {
  totalResults: PropTypes.array,
}

const mapStateToProps = state => ({
  totalResults: state.selectorReducer.search.totalResults,
})

export default connect(mapStateToProps, null)(SearchResultsPaging)
