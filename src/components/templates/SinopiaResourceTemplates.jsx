// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import Download from 'components/templates/Download'
import { newResource } from 'actionCreators/resources'
import { rootResource } from 'selectors/resourceSelectors'

/**
 * This is the list view of all the templates
 */
const SinopiaResourceTemplates = (props) => {
  const dispatch = useDispatch()

  const resourceTemplateSummaries = useSelector(state => Object.values(state.selectorReducer.entities.resourceTemplateSummaries))
  const error = useSelector(state => state.selectorReducer.editor.retrieveResourceTemplateError)
  const rtRoot = useSelector(state => rootResource(state))

  const [navigateEditor, setNavigateEditor] = useState(false)

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && rtRoot && !error) {
      props.history.push('/editor')
    }
  }, [navigateEditor, rtRoot, props.history, error])

  const handleClick = (resourceTemplateId, event) => {
    event.preventDefault()
    dispatch(newResource(resourceTemplateId)).then(result => setNavigateEditor(result))
  }

  const linkFormatter = (cell, row) => (<Link to={{ pathname: '/editor', state: { } }} onClick={e => handleClick(row.id, e)}>{row.name}</Link>)

  const downloadLinkFormatter = (cell, row) => (<Download resourceTemplateId={ row.id } groupName={ row.group } />)

  const createResourceMessage = props.messages.length === 0
    ? (<span />)
    : (
      <div className="alert alert-info">
        { props.messages.join(', ') }
      </div>
    )

  const errorMessage = error === undefined
    ? (<span />)
    : (<div className="alert alert-warning">{ error }</div>)

  const defaultSorted = [{
    dataField: 'name', // default sort column name
    order: 'asc', // default sort order
  }]

  const columns = [
    {
      dataField: 'name',
      text: 'Template name',
      sort: true,
      formatter: linkFormatter,
      headerStyle: { backgroundColor: '#F8F6EF', width: '30%' },
      style: { wordBreak: 'break-all' },
    },
    {
      dataField: 'id',
      text: 'ID',
      sort: true,
      headerStyle: { backgroundColor: '#F8F6EF', width: '30%' },
      style: { wordBreak: 'break-all' },
    },
    {
      dataField: 'author',
      text: 'Author',
      sort: true,
      headerStyle: { backgroundColor: '#F8F6EF', width: '10%' },
      style: { wordBreak: 'break-all' },
    },
    {
      dataField: 'remark',
      text: 'Guiding statement',
      sort: false,
      headerStyle: { backgroundColor: '#F8F6EF', width: '22%' },
      style: { wordBreak: 'break-all' },
    },
    {
      dataField: 'download',
      text: 'Download',
      sort: false,
      formatter: downloadLinkFormatter,
      headerStyle: { backgroundColor: '#F8F6EF', width: '8%' },
      style: { wordBreak: 'break-all' },
      attrs: {
        'data-testid': 'download-col-header',
      },
    },
  ]

  return (
    <div>
      { createResourceMessage }
      { errorMessage }
      <h4>Available Resource Templates in Sinopia</h4>
      <BootstrapTable
        id="resource-template-list"
        keyField="key"
        data={ resourceTemplateSummaries }
        columns={ columns }
        defaultSorted={ defaultSorted }/>
    </div>
  )
}

SinopiaResourceTemplates.propTypes = {
  messages: PropTypes.array,
  resourceTemplateSummaries: PropTypes.array,
  newResource: PropTypes.func,
  history: PropTypes.object,
  error: PropTypes.string,
  rootResource: PropTypes.object,
}

export default SinopiaResourceTemplates
