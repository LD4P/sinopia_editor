// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { newResource, loadResource } from 'actionCreators/resources'
import { selectErrors } from 'selectors/errors'
import { selectCurrentResourceKey, selectNormSubject } from 'selectors/resources'
import _ from 'lodash'
import Alerts from '../Alerts'
import ResourceTemplateSearchResult from './ResourceTemplateSearchResult'
import { selectHistoricalTemplates } from 'selectors/templates'
import { selectSearchResults } from 'selectors/search'

// Errors from loading a new resource from this page.
export const newResourceErrorKey = 'newresource'

/**
 * This is the list view of all the templates
 */
const SinopiaResourceTemplates = (props) => {
  const dispatch = useDispatch()
  const searchResults = useSelector((state) => selectSearchResults(state, 'template'))
  const historicallyUsedTemplateResults = useSelector((state) => selectHistoricalTemplates(state))

  const errors = useSelector((state) => selectErrors(state, newResourceErrorKey))
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))

  const [navigateEditor, setNavigateEditor] = useState(false)

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && resource && _.isEmpty(errors)) {
      props.history.push(`/editor/${resource.subjectTemplateKey}`)
    }
  }, [navigateEditor, resource, props.history, errors])

  const topRef = useRef(null)

  const handleClick = (resourceTemplateId, event) => {
    event.preventDefault()
    dispatch(newResource(resourceTemplateId, newResourceErrorKey)).then((result) => {
      setNavigateEditor(result)
      if (!result && topRef.current) window.scrollTo(0, topRef.current.offsetTop)
    })
  }

  const handleCopy = (resourceURI) => {
    dispatch(loadResource(resourceURI, newResourceErrorKey, true)).then((result) => {
      setNavigateEditor(result)
    })
  }

  const handleEdit = (resourceURI) => {
    dispatch(loadResource(resourceURI, newResourceErrorKey)).then((result) => {
      setNavigateEditor(result)
    })
  }

  let history
  if (!_.isEmpty(historicallyUsedTemplateResults)) {
    history = (
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h3><button className="btn btn-link collapse-heading collapsed"
                      data-toggle="collapse" data-target="#historicalTemplates">Most recently used resource templates</button>
          </h3>
        </div>
        <div id="historicalTemplates" className="collapse" style={{ padding: '5px' }}>
          <ResourceTemplateSearchResult results={historicallyUsedTemplateResults} handleClick={handleClick} handleEdit={handleEdit} handleCopy={handleCopy} />
        </div>
      </div>
    )
  }

  return (
    <section id="resource-templates" ref={topRef}>
      <Alerts errorKey={newResourceErrorKey} />
      { history }
      { _.isEmpty(searchResults)
        ? <div className="alert alert-warning" id="no-rt-warning">No resource templates match.</div>
        : <ResourceTemplateSearchResult results={searchResults} handleClick={handleClick} handleEdit={handleEdit} handleCopy={handleCopy} />
      }
    </section>
  )
}

SinopiaResourceTemplates.propTypes = {
  history: PropTypes.object,
}

export default SinopiaResourceTemplates
