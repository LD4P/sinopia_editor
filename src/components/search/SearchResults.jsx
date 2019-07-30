// Copyright 2019 Stanford University see LICENSE for license
/* eslint no-unused-vars: 0 */ // --> OFF
/* eslint max-params: ["error", 4] */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Config from 'Config'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import { getCurrentUser } from 'authSelectors'
import { retrieveResource } from 'actionCreators/resources'
import Button from 'react-bootstrap/lib/Button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'

const SearchResults = (props) => {
  const handleClick = resourceURI => props.loadResource(props.currentUser, resourceURI)

  // This returns the current row number + 1 in order to include it in the displayed table
  const indexFormatter = (_cell, _row, rowIndex, _formatExtraData) => rowIndex + 1

  const linkFormatter = (_cell, row) => (
    <ButtonToolbar>
      <Button bsStyle="link" onClick={e => handleClick(`${Config.sinopiaServerBase}/${row.uri}`, e)}>{row.title}</Button>
    </ButtonToolbar>
  )

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
    formatter: linkFormatter,
    headerStyle: { backgroundColor: '#F8F6EF', width: '95%' },
  }]

  return (
    <div id="search-results" className="row">
      <div className="col-sm-2"></div>
      <div className="col-sm-8">
        <h3>Your List of Bibliographic Metadata Stored in Sinopia</h3>
        <BootstrapTable id="search-results-list" keyField="uri" data={ props.searchResults } columns={ columns } />
      </div>
      <div className="col-sm-2"></div>
    </div>
  )
}

SearchResults.propTypes = {
  searchResults: PropTypes.array,
  loadResource: PropTypes.func,
  currentUser: PropTypes.object,
  history: PropTypes.object,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  searchResults: state.selectorReducer.search.results,
})

const mapDispatchToProps = (dispatch, ourProps) => ({
  loadResource: (user, uri) => {
    dispatch(retrieveResource(user, uri)).then(() => {
      ourProps.history.push('/editor')
    })
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults)
