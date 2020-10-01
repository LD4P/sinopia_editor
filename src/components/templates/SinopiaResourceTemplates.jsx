// Copyright 2019 Stanford University see LICENSE for license

import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Alerts from '../Alerts'
import ResourceTemplateSearchResult from './ResourceTemplateSearchResult'
import { selectHistoricalTemplates } from 'selectors/templates'
import { selectSearchResults } from 'selectors/search'
import useResource from 'hooks/useResource'

// Errors from loading a new resource from this page.
export const newResourceErrorKey = 'newresource'

/**
 * This is the list view of all the templates
 */
const SinopiaResourceTemplates = (props) => {
  const searchResults = useSelector((state) => selectSearchResults(state, 'template'))
  const historicalTemplates = useSelector((state) => selectHistoricalTemplates(state))

  const topRef = useRef(null)

  const { handleNew, handleCopy, handleEdit } = useResource(props.history, newResourceErrorKey, topRef)

  let history
  if (!_.isEmpty(historicalTemplates)) {
    history = (
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <h3><button className="btn btn-link collapse-heading collapsed"
                      data-toggle="collapse" data-target="#historicalTemplates">Most recently used templates</button>
          </h3>
        </div>
        <div id="historicalTemplates" className="collapse" style={{ padding: '5px' }}>
          <ResourceTemplateSearchResult results={historicalTemplates} handleClick={handleNew} handleEdit={handleEdit} handleCopy={handleCopy} />
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
        : <ResourceTemplateSearchResult results={searchResults} handleClick={handleNew} handleEdit={handleEdit} handleCopy={handleCopy} />
      }
    </section>
  )
}

SinopiaResourceTemplates.propTypes = {
  history: PropTypes.object,
}

export default SinopiaResourceTemplates
