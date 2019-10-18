// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Download from 'components/templates/Download'
import { newResource } from 'actionCreators/resources'
import { rootResource } from 'selectors/resourceSelectors'

/**
 * This is the list view of all the templates
 */
const SinopiaResourceTemplates = (props) => {
  const dispatch = useDispatch()

  const resourceTemplateSummaries = useSelector((state) => {
    // This is undefined if have not yet fetched resource template summaries.
    if (state.selectorReducer.entities.resourceTemplateSummaries === undefined) return undefined
    return Object.values(state.selectorReducer.entities.resourceTemplateSummaries)
  })
  const sortedResourceTemplateSummaries = useMemo(() => {
    if (resourceTemplateSummaries === undefined) return []
    return resourceTemplateSummaries.sort((a, b) => a.name.localeCompare(b.name))
  }, [resourceTemplateSummaries])
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

  const createResourceMessage = () => {
    if (props.messages.length === 0) return <span />
    const messageItems = props.messages.map(message => <li key={message}>{message}</li>)
    return (
      <div className="alert alert-info">
        <ul className="list-unstyled" style={{ marginBottom: 0 }}>
          { messageItems }
        </ul>
      </div>
    )
  }
  const generateRows = () => {
    const rows = []
    sortedResourceTemplateSummaries.forEach((row) => {
      rows.push(<tr key={row.id}>
        <td style={{ wordBreak: 'break-all' }}>
          <Link to={{ pathname: '/editor', state: { } }} onClick={e => handleClick(row.id, e)}>{row.name}</Link>
        </td>
        <td style={{ wordBreak: 'break-all' }}>
          { row.id }
        </td>
        <td style={{ wordBreak: 'break-all' }}>
          { row.author }
        </td>
        <td style={{ wordBreak: 'break-all' }}>
          { row.remark }
        </td>
        <td>
          <Download resourceTemplateId={ row.id } groupName={ row.group } />
        </td>
      </tr>)
    })
    return rows
  }

  const errorMessage = error === undefined
    ? (<span />)
    : (<div className="alert alert-warning">{ error }</div>)

  // Don't render until resource template summaries have been retrieved.
  // This makes testing deterministic (viz., when a result appears that result reflects the found rts)
  if (resourceTemplateSummaries === undefined) {
    return null
  }

  if (resourceTemplateSummaries.length === 0) {
    return (
      <div>
        <h4>Available Resource Templates in Sinopia</h4>
        <div className="alert alert-warning" id="resource-template-list">No resource template are available.
          This may be because none have been loaded or there is an error with the Sinopia server.</div>
      </div>
    )
  }

  return (
    <div>
      { createResourceMessage() }
      { errorMessage }
      <h4>Available Resource Templates in Sinopia</h4>
      <table className="table table-bordered"
             id="resource-template-list">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#F8F6EF', width: '30%' }}>Template name</th>
            <th style={{ backgroundColor: '#F8F6EF', width: '30%' }}>ID</th>
            <th style={{ backgroundColor: '#F8F6EF', width: '10%' }}>Author</th>
            <th style={{ backgroundColor: '#F8F6EF', width: '22%' }}>Guiding statement</th>
            <th style={{ backgroundColor: '#F8F6EF', width: '8%' }}
                data-testid="download-col-header">Download</th>
          </tr>
        </thead>
        <tbody>
          { generateRows() }
        </tbody>
      </table>
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
