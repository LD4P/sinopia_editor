// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { newResource } from 'actionCreators/resources'
import { rootResource as rootResourceSelector, rootResourceTemplateId as rootResourceTemplateIdSelector, findErrors } from 'selectors/resourceSelectors'
import _ from 'lodash'
import Alerts from '../Alerts'
import ResourceTemplateSearchResult from './ResourceTemplateSearchResult'

// Errors from loading a new resource from this page.
export const newResourceErrorKey = 'newresource'

/**
 * This is the list view of all the templates
 */
const SinopiaResourceTemplates = (props) => {
  const dispatch = useDispatch()
  const searchResults = useSelector(state => state.selectorReducer.templateSearch)
  const historicallyUsedTemplates = useSelector(state => state.selectorReducer.historicalTemplates)

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

  let history
  if (historicallyUsedTemplates.totalResults > 0) {
    history = (
      <React.Fragment>
        <h3>Most recently used resource templates</h3>
        <ResourceTemplateSearchResult search={historicallyUsedTemplates} handleClick={handleClick} />
      </React.Fragment>
    )
  }

  return (
    <section id="resource-templates" ref={topRef}>
      <Alerts errorKey={newResourceErrorKey} />
      { history }
      <h3>Available resource templates in Sinopia</h3>
      { searchResults.totalResults > 0
        ? <ResourceTemplateSearchResult search={searchResults} handleClick={handleClick} />
        : <div className="alert alert-warning" id="no-rt-warning">No resource templates match.</div>
      }
    </section>
  )
}

SinopiaResourceTemplates.propTypes = {
  history: PropTypes.object,
}

export default SinopiaResourceTemplates
