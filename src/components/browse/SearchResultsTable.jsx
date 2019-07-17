// Copyright 2019 Stanford University see LICENSE for license
/* eslint no-unused-vars: 0 */ // --> OFF
/* eslint max-params: ["error", 4] */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'

class SearchResultsTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resultsCount: 0,
      searchResults: [],
    }
  }

  // This returns the current row number + 1 in order to include it in the displayed table
  indexFormatter(_cell, _row, rowIndex, _formatExtraData) {
    return rowIndex + 1
  }

  titleFormatter(_cell, row, _rowIndex, _formatExtraData) {
    return (<a href="http://localhost:8888">{ row._source.title }</a>)
  }

  render() {
    if (this.props.resultsCount === 0) {
      return null
    }

    const columns = [{
      dataField: 'index',
      text: 'ID',
      sort: false,
      formatter: this.indexFormatter,
      headerStyle: { backgroundColor: '#F8F6EF', width: '5%' },
    },
    {
      dataField: '_source.title',
      text: 'Title',
      sort: false,
      formatter: this.titleFormatter,
      headerStyle: { backgroundColor: '#F8F6EF', width: '95%' },
    }]

    return (
      <div className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-8">
          <h3>Your List of Bibliographic Metadata Stored in Sinopia</h3>
          <BootstrapTable id="search-results-list" keyField="hits" data={ this.props.searchResults } columns={ columns } />
        </div>
        <div className="col-sm-2"></div>
      </div>
    )
  }
}

SearchResultsTable.propTypes = {
  resultsCount: PropTypes.number,
  searchResults: PropTypes.array,
}

export default connect(null, null)(SearchResultsTable)
