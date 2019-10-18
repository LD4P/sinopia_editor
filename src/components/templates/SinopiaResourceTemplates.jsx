// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplateRow from './ResourceTemplateRow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { newResource } from 'actionCreators/resources'
import { rootResource } from 'selectors/resourceSelectors'

/**
 * This is the list view of all the templates
 */
const SinopiaResourceTemplates = (props) => {
  const dispatch = useDispatch()
  const [sortColumn, setSortColumn] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')

  const resourceTemplateSummaries = useSelector((state) => {
    // This is undefined if have not yet fetched resource template summaries.
    if (state.selectorReducer.entities.resourceTemplateSummaries === undefined) return undefined
    return Object.values(state.selectorReducer.entities.resourceTemplateSummaries)
  })

  const sortedResourceTemplateSummaries = useMemo(() => {
    if (resourceTemplateSummaries === undefined) return []

    return resourceTemplateSummaries.sort((a, b) => {
      let first = a
      let second = b
      if (sortDirection === 'desc') {
        first = b
        second = a
      }

      if (first[sortColumn]) return first[sortColumn].localeCompare(second[sortColumn])
      return 1
    })
  }, [resourceTemplateSummaries, sortColumn, sortDirection])

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

  const toggleSortDirection = () => {
    if (sortDirection === 'asc') {
      return setSortDirection('desc')
    }
    setSortDirection('asc')
  }

  const changeSort = (column) => {
    if (sortColumn === column) {
      return toggleSortDirection()
    }
    setSortColumn(column)
  }

  const rows = sortedResourceTemplateSummaries.map(row => <ResourceTemplateRow row={row} key={row.id} navigate={handleClick}/>)

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

  const sortButton = (value, label) => {
    let icon = faSort
    if (value === sortColumn) {
      icon = sortDirection === 'asc' ? faSortUp : faSortDown
    }
    return (
      <button className="btn btn-link" style={{ width: '100%' }} onClick={() => changeSort(value)}>{label}
        <span className="pull-right" style={{ color: '#999' }}><FontAwesomeIcon icon={icon} /></span>
      </button>
    )
  }

  return (
    <div>
      { errorMessage }
      <h4>Available Resource Templates in Sinopia</h4>
      <table className="table table-bordered"
             id="resource-template-list">
        <thead>
          <tr>
            <th style={{ backgroundColor: '#F8F6EF', width: '30%' }}>
              {sortButton('name', 'Template name')}
            </th>
            <th style={{ backgroundColor: '#F8F6EF', width: '30%' }}>
              {sortButton('id', 'ID')}
            </th>
            <th style={{ backgroundColor: '#F8F6EF', width: '10%' }}>
              {sortButton('author', 'Author')}
            </th>
            <th style={{ backgroundColor: '#F8F6EF', width: '22%' }}>
              {sortButton('remark', 'Guiding statement')}
            </th>
            <th style={{ backgroundColor: '#F8F6EF', width: '8%' }}
                data-testid="download-col-header">Download</th>
          </tr>
        </thead>
        <tbody>
          { rows }
        </tbody>
      </table>
    </div>
  )
}

SinopiaResourceTemplates.propTypes = {
  history: PropTypes.object,
}

export default SinopiaResourceTemplates
