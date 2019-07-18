// Copyright 2019 Stanford University see LICENSE for license
/* eslint no-unused-vars: 0 */ // --> OFF
/* eslint max-params: ["error", 4] */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'

const SearchResults = (props) => {
  // This returns the current row number + 1 in order to include it in the displayed table
  const indexFormatter = (_cell, _row, rowIndex, _formatExtraData) => {
    return rowIndex + 1
  }

  const titleFormatter = (_cell, row, _rowIndex, _formatExtraData) => {
    return (<a href="http://localhost:8888">{ row.title }</a>)
  }

  if (props.searchResults.length === 0) {
    return null
  }

  const columns = [{
    dataField: 'index',
    text: 'ID',
    sort: false,
    formatter: indexFormatter,
    headerStyle: { backgroundColor: '#F8F6EF', width: '5%' },
  },
  {
    dataField: '_source.title',
    text: 'Title',
    sort: false,
    formatter: titleFormatter,
    headerStyle: { backgroundColor: '#F8F6EF', width: '95%' },
  }]

  return (
    <div className="row">
       <div className="col-sm-2"></div>
      <div className="col-sm-8">
        <h3>Your List of Bibliographic Metadata Stored in Sinopia</h3>
        <BootstrapTable id="search-results-list" keyField="hits" data={ props.searchResults } columns={ columns } />
      </div>
      <div className="col-sm-2"></div>
    </div>
  )
}

SearchResults.propTypes = {
  searchResults: PropTypes.array,
}

const mapStateToProps = (state) => {
  const searchResults = state.selectorReducer.search.results
  return {
    searchResults,
  }
}

export default connect(mapStateToProps, null)(SearchResults)
