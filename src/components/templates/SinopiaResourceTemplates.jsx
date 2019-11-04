// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import ResourceTemplateRow from './ResourceTemplateRow'
import { newResource } from 'actionCreators/resources'
import { rootResource as rootResourceSelector, rootResourceTemplateId as rootResourceTemplateIdSelector, findErrors } from 'selectors/resourceSelectors'
import _ from 'lodash'
import Alerts from '../Alerts'

// Errors from loading a new resource from this page.
export const newResourceErrorKey = 'newresource'

/**
 * This is the list view of all the templates
 */
const SinopiaResourceTemplates = (props) => {
  const dispatch = useDispatch()

  const resourceTemplateSummaries = useSelector(state => state.selectorReducer.templateSearch.results)

  const errors = useSelector(state => findErrors(state, newResourceErrorKey))
  const rootResource = useSelector(state => rootResourceSelector(state))
  const rootResourceTemplateId = useSelector(state => rootResourceTemplateIdSelector(state))

  const [navigateEditor, setNavigateEditor] = useState(false)

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && rootResource && rootResourceTemplateId && _.isEmpty(errors)) {
      props.history.push(`/editor/${rootResourceTemplateId}`)
    }
  }, [navigateEditor, rootResource, rootResourceTemplateId, props.history, errors])

  const topRef = useRef(null)

  const handleClick = (resourceTemplateId, event) => {
    event.preventDefault()
    dispatch(newResource(resourceTemplateId, newResourceErrorKey)).then((result) => {
      setNavigateEditor(result)
      if (!result) window.scrollTo(0, topRef.current.offsetTop)
    })
  }

  const rows = resourceTemplateSummaries.map(row => <ResourceTemplateRow row={row} key={row.id} navigate={handleClick}/>)

  let body = (
    <table className="table table-bordered"
           id="resource-template-list">
      <thead>
        <tr>
          <th style={{ backgroundColor: '#F8F6EF', width: '20%' }}>
            Label
          </th>
          <th style={{ backgroundColor: '#F8F6EF', width: '20%' }}>
            ID
          </th>
          <th style={{ backgroundColor: '#F8F6EF', width: '20%' }}>
            Resource URI
          </th>
          <th style={{ backgroundColor: '#F8F6EF', width: '10%' }}>
            Author
          </th>
          <th style={{ backgroundColor: '#F8F6EF', width: '5%' }}>
            Date
          </th>
          <th style={{ backgroundColor: '#F8F6EF', width: '17%' }}>
            Guiding statement
          </th>
          <th style={{ backgroundColor: '#F8F6EF', width: '8%' }}
              data-testid="download-col-header">
              Download
          </th>
        </tr>
      </thead>
      <tbody>
        { rows }
      </tbody>
    </table>
  )
  if (resourceTemplateSummaries.length === 0) {
    body = (
      <div>
        <div className="alert alert-warning" id="no-rt-warning">No resource templates match.</div>
      </div>
    )
  }

  return (
    <div id="resource-templates" ref={topRef}>
      <Alerts errorKey={newResourceErrorKey} />
      { body }
    </div>
  )
}

SinopiaResourceTemplates.propTypes = {
  history: PropTypes.object,
}

export default SinopiaResourceTemplates
