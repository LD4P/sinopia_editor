// Copyright 2019 Stanford University see LICENSE for license

import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'

const QASearchResults = (props) => {
  const tableData = useMemo(() => props.searchResults.map((result) => {
    const classContext = result.context.find(context => context.property === 'Type')
    const classes = classContext ? classContext.values : []

    return {
      label: result.label,
      uri: result.uri,
      classes,
    }
  }),
  [props.searchResults])

  function classFormatter(_cell, row) {
    return (
      <ul className="list-unstyled">
        {row.classes.map(clazz => <li key={clazz}>{clazz}</li>)}
      </ul>
    )
  }

  const columns = [
    {
      dataField: 'label',
      text: 'Label',
      sort: false,
      headerStyle: { backgroundColor: '#F8F6EF', width: '95%' },
    },
    {
      dataField: 'classes',
      text: 'Classes',
      sort: false,
      headerStyle: { backgroundColor: '#F8F6EF', width: '95%' },
      formatter: classFormatter,
    }]

  return (
    <div id="search-results" className="row">
      <div className="col-sm-2"></div>
      <div className="col-sm-8">
        <BootstrapTable id="search-results-list" keyField="uri" data={ tableData } columns={ columns } />
      </div>
      <div className="col-sm-2"></div>
    </div>
  )
}

QASearchResults.propTypes = {
  searchResults: PropTypes.array,
}

const mapStateToProps = state => ({
  searchResults: state.selectorReducer.search.results,
})


export default connect(mapStateToProps)(QASearchResults)
