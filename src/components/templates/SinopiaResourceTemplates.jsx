// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import Download from 'components/templates/Download'
import { connect } from 'react-redux'
import { newResource as newResourceCreator } from 'actionCreators/resources'

/**
 * This is the list view of all the templates
 */
class SinopiaResourceTemplates extends Component {
  handleClick = resourceTemplateId => this.props.newResource(resourceTemplateId)

  linkFormatter = (cell, row) => (
    <Link to={{ pathname: '/editor', state: { } }} onClick={e => this.handleClick(row.id, e)}>{cell}</Link>
  )

  downloadLinkFormatter = (cell, row) => (<Download resourceTemplateId={ row.id } groupName={ row.group } />)

  render() {
    if (this.props.resourceTemplateSummaries.length === 0) {
      return (
        <div className="alert alert-warning alert-dismissible">
          <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
          No connection to the Sinopia Server is available, or there are no resources for any group.
        </div>
      )
    }

    const createResourceMessage = this.props.messages.length === 0
      ? (<span />)
      : (
        <div className="alert alert-info">
          { this.props.messages.join(', ') }
        </div>
      )

    const defaultSorted = [{
      dataField: 'name', // default sort column name
      order: 'asc', // default sort order
    }]

    const columns = [
      {
        dataField: 'name',
        text: 'Template name',
        sort: true,
        formatter: this.linkFormatter,
        headerStyle: { backgroundColor: '#F8F6EF', width: '30%' },
        style: { 'word-break': 'break-all' },
      },
      {
        dataField: 'id',
        text: 'ID',
        sort: true,
        headerStyle: { backgroundColor: '#F8F6EF', width: '30%' },
        style: { 'word-break': 'break-all' },
      },
      {
        dataField: 'author',
        text: 'Author',
        sort: true,
        headerStyle: { backgroundColor: '#F8F6EF', width: '10%' },
        style: { 'word-break': 'break-all' },
      },
      {
        dataField: 'remark',
        text: 'Guiding statement',
        sort: false,
        headerStyle: { backgroundColor: '#F8F6EF', width: '22%' },
        style: { 'word-break': 'break-all' },
      },
      {
        dataField: 'download',
        text: 'Download',
        sort: false,
        formatter: this.downloadLinkFormatter,
        headerStyle: { backgroundColor: '#F8F6EF', width: '8%' },
        style: { 'word-break': 'break-all' },
      },
    ]

    return (
      <div>
        { createResourceMessage }
        <h4>Available Resource Templates in Sinopia</h4>
        <BootstrapTable
          id="resource-template-list"
          keyField="key"
          data={ this.props.resourceTemplateSummaries }
          columns={ columns }
          defaultSorted={ defaultSorted }/>
      </div>
    )
  }
}

SinopiaResourceTemplates.propTypes = {
  messages: PropTypes.array,
  resourceTemplateSummaries: PropTypes.array,
  newResource: PropTypes.func,
}

const mapStateToProps = (state) => {
  const resourceTemplateSummaries = Object.values(state.selectorReducer.entities.resourceTemplateSummaries)

  return {
    resourceTemplateSummaries,
  }
}


const mapDispatchToProps = dispatch => ({
  newResource: (resourceTemplateId) => {
    dispatch(newResourceCreator(resourceTemplateId))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SinopiaResourceTemplates)
