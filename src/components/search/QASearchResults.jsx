// Copyright 2019 Stanford University see LICENSE for license

import React, { useMemo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { clearErrors, appendError } from 'actions/index'
import { showModal } from 'actions/modals'
import ResourceTemplateChoiceModal from '../ResourceTemplateChoiceModal'
import { getTerm } from 'utilities/QuestioningAuthority'
import useResource from 'hooks/useResource'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import Alerts from '../Alerts'

// Errors from retrieving a resource from this page.
export const searchQARetrieveErrorKey = 'searchqaresource'

const QASearchResults = (props) => {
  const dispatch = useDispatch()

  const searchResults = useSelector(state => state.selectorReducer.search.results)
  const searchUri = useSelector(state => state.selectorReducer.search.uri)

  const [resourceURI, setResourceURI] = useState(null)
  // Resource ID is for handling non-LD QA authorities, e.g., Discog
  const [resourceId, setResourceId] = useState(null)
  const [resourceTemplateId, setResourceTemplateId] = useState(null)
  const [resourceN3, setResourceN3] = useState(null)
  useResource(resourceN3, resourceURI, resourceTemplateId, searchQARetrieveErrorKey, props.history)

  // Retrieve N3 from QA
  useEffect(() => {
    if (!resourceURI || !searchUri) {
      return
    }
    dispatch(clearErrors(searchQARetrieveErrorKey))
    getTerm(resourceURI, resourceId, searchUri)
      .then(resourceN3 => setResourceN3(resourceN3))
      .catch(err => dispatch(appendError(`Error retrieving resource: ${err.toString()}`)))
  }, [dispatch, resourceId, resourceURI, searchUri])

  // Transform the results into the format to be displayed in the table.
  const tableData = useMemo(() => searchResults.map((result) => {
    // Discogs returns a context that is not an array
    const types = []
    const contexts = {}
    if (result.context) {
      if (Array.isArray(result.context)) {
        const classContext = result.context.find(context => context.property === 'Type')
        if (classContext) {
          types.push(...classContext.values)
        }
        const excludeProperties = ['Type', 'Title', 'Image URL']
        result.context.forEach((context) => {
          if (!excludeProperties.includes(context.property)) contexts[context.property] = context.values
        })
      } else if (Array.isArray(result.context.Type)) {
        types.push(...result.context.Type)
      }
    }

    return {
      label: result.label,
      uri: result.uri,
      id: result.id,
      types,
      contexts,
    }
  }),
  [searchResults])

  const handleCopy = (uri, id) => {
    setResourceURI(uri)
    setResourceId(id)
    setResourceTemplateId(null)
    dispatch(showModal('ResourceTemplateChoiceModal'))
  }

  // Passed into resource template chooser to allow it to pass back selected resource template id.
  const chooseResourceTemplate = (resourceTemplateId) => {
    setResourceTemplateId(resourceTemplateId)
  }

  const typesFormatter = types => (
    <ul className="list-unstyled">
      {types.map(type => <li key={type}>{type}</li>)}
    </ul>
  )

  const actionFormatter = (uri, id) => (
    <div>
      <button type="button"
              className="btn btn-link"
              onClick={() => handleCopy(uri, id)}
              title="Copy"
              aria-label="Copy this resource">
        <FontAwesomeIcon icon={faCopy} size="2x" />
      </button>
    </div>
  )

  const contextFormatter = (contexts) => {
    const contextItems = Object.entries(contexts).map(([property, values]) => (
      <li key={property}><strong>{property}</strong>: {values}</li>
    ))
    return (<ul className="list-unstyled">{contextItems}</ul>)
  }

  const generateRows = () => {
    const rows = []
    tableData.forEach((row) => {
      rows.push(<tr key={row.uri}>
        <td>{ row.label }</td>
        <td>{typesFormatter(row.types)}</td>
        <td>{contextFormatter(row.contexts)}</td>
        <td>{actionFormatter(row.uri, row.id)}</td>
      </tr>)
    })
    return rows
  }

  if (searchResults.length === 0) {
    return null
  }

  return (
    <div id="search-results" className="row">
      <Alerts errorKey={searchQARetrieveErrorKey} />
      <div className="col-sm-2"></div>
      <div className="col-sm-8">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="search-header" style={{ width: '40%' }}>
                Label
              </th>
              <th className="search-header" style={{ width: '25%' }}>
                Classes
              </th>
              <th className="search-header" style={{ width: '25%' }}>
                Context
              </th>
              <th className="search-header" style={{ width: '10%' }}/>
            </tr>
          </thead>
          <tbody>
            { generateRows() }
          </tbody>
        </table>
      </div>
      <div className="col-sm-2"></div>
      <ResourceTemplateChoiceModal choose={chooseResourceTemplate} />
    </div>
  )
}

QASearchResults.propTypes = {
  history: PropTypes.object.isRequired,
}

export default QASearchResults
