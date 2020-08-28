// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useEffect, useState, useRef, useMemo,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { newResource, loadResource } from 'actionCreators/resources'
import { selectErrors } from 'selectors/errors'
import { selectCurrentResource } from 'selectors/resources'
import _ from 'lodash'
import Alerts from '../Alerts'
import ResourceTemplateSearchResult from './ResourceTemplateSearchResult'
import { selectHistoricalTemplates } from 'selectors/templates'
import { selectCurrentUser } from 'selectors/authenticate'

// Errors from loading a new resource from this page.
export const newResourceErrorKey = 'newresource'

/**
 * This is the list view of all the templates
 */
const SinopiaResourceTemplates = (props) => {
  const dispatch = useDispatch()
  const searchResults = useSelector((state) => state.selectorReducer.templateSearch)
  const currentUser = useSelector((state) => selectCurrentUser(state))
  const historicallyUsedTemplates = useSelector((state) => selectHistoricalTemplates(state))

  // Transform to the result structure.
  const historicallyUsedTemplateResults = useMemo(() => {
    const results = historicallyUsedTemplates.map((template) => ({
      id: template.key,
      resourceLabel: template.label,
      resourceURI: template.class,
      author: template.author,
      remark: template.remark,
      date: template.date,
    }))
    return {
      results,
      totalResults: results.length,
      error: undefined,
    }
  }, [historicallyUsedTemplates])

  const errors = useSelector((state) => selectErrors(state, newResourceErrorKey))
  const resource = useSelector((state) => selectCurrentResource(state))

  const [navigateEditor, setNavigateEditor] = useState(false)

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && resource && _.isEmpty(errors)) {
      const resourceTemplateId = resource.subjectTemplate.id
      props.history.push(`/editor/${resourceTemplateId}`)
    }
  }, [navigateEditor, resource, props.history, errors])

  const topRef = useRef(null)

  const handleClick = (resourceTemplateId, event) => {
    event.preventDefault()
    dispatch(newResource(resourceTemplateId, newResourceErrorKey)).then((result) => {
      setNavigateEditor(result)
      if (!result) window.scrollTo(0, topRef.current.offsetTop)
    })
  }

  const handleCopy = (resourceURI) => {
    dispatch(loadResource(currentUser, resourceURI, newResourceErrorKey, true)).then((result) => {
      setNavigateEditor(result)
    })
  }

  const handleEdit = (resourceURI) => {
    dispatch(loadResource(currentUser, resourceURI, newResourceErrorKey)).then((result) => {
      setNavigateEditor(result)
    })
  }

  let history
  if (historicallyUsedTemplateResults.totalResults > 0) {
    history = (
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h3><button className="btn btn-link collapse-heading collapsed"
                      data-toggle="collapse" data-target="#historicalTemplates">Most recently used resource templates</button>
          </h3>
        </div>
        <div id="historicalTemplates" className="collapse" style={{ padding: '5px' }}>
          <ResourceTemplateSearchResult search={historicallyUsedTemplateResults} handleClick={handleClick} handleEdit={handleEdit} handleCopy={handleCopy} />
        </div>
      </div>
    )
  }

  return (
    <section id="resource-templates" ref={topRef}>
      <Alerts errorKey={newResourceErrorKey} />
      { history }
      { searchResults.totalResults > 0
        ? <ResourceTemplateSearchResult search={searchResults} handleClick={handleClick} handleEdit={handleEdit} handleCopy={handleCopy} />
        : <div className="alert alert-warning" id="no-rt-warning">No resource templates match.</div>
      }
    </section>
  )
}

SinopiaResourceTemplates.propTypes = {
  history: PropTypes.object,
}

export default SinopiaResourceTemplates
