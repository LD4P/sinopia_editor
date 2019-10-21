// Copyright 2019 Stanford University see LICENSE for license

import React, { useMemo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { showModal } from 'actions/index'
import ResourceTemplateChoiceModal from '../ResourceTemplateChoiceModal'
import { getTerm } from 'utilities/qa'
import { existingResource as existingResourceAction } from 'actionCreators/resources'
import { rootResource as rootResourceSelector } from 'selectors/resourceSelectors'
import useResource from 'hooks/useResource'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import Alert from '../Alert'

const QASearchResults = (props) => {
  const dispatch = useDispatch()

  const searchResults = useSelector(state => state.selectorReducer.search.results)
  const searchUri = useSelector(state => state.selectorReducer.search.uri)
  const rootResource = useSelector(state => rootResourceSelector(state))

  const [error, setError] = useState(null)
  const [resourceURI, setResourceURI] = useState(null)
  // Resource ID is for handling non-LD QA authorities, e.g., Discog
  const [resourceId, setResourceId] = useState(null)
  const [resourceTemplateId, setResourceTemplateId] = useState(null)
  const [resourceN3, setResourceN3] = useState(null)
  const [resourceState, unusedDataset, useResourceError] = useResource(resourceN3, resourceURI, resourceTemplateId, rootResource, props.history)

  useEffect(() => {
    if (resourceState && unusedDataset) {
      dispatch(existingResourceAction(resourceState, unusedDataset.toCanonical()))
    }
  }, [dispatch, resourceState, unusedDataset])

  // Retrieve N3 from QA
  useEffect(() => {
    if (!resourceURI || !searchUri) {
      return
    }
    getTerm(resourceURI, resourceId, searchUri)
      .then(resourceN3 => setResourceN3(resourceN3))
      .catch(err => setError(`Error retrieving resource: ${err.toString()}`))
  }, [resourceId, resourceURI, searchUri])

  // Transform the results into the format to be displayed in the table.
  const tableData = useMemo(() => searchResults.map((result) => {
    // Discogs returns a context that is not an array
    const types = []
    if (result.context) {
      if (Array.isArray(result.context)) {
        const classContext = result.context.find(context => context.property === 'Type')
        if (classContext) {
          types.push(...classContext.values)
        }
      } else if (Array.isArray(result.context.Type)) {
        types.push(...result.context.Type)
      }
    }

    return {
      label: result.label,
      uri: result.uri,
      id: result.id,
      types,
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

  function typesFormatter(types) {
    return (
      <ul className="list-unstyled">
        {types.map(type => <li key={type}>{type}</li>)}
      </ul>
    )
  }

  function actionFormatter(uri, id) {
    return (
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
  }

  const generateRows = () => {
    const rows = []
    tableData.forEach((row) => {
      rows.push(<tr key={row.uri}>
        <td>{ row.label }</td>
        <td>{typesFormatter(row.types)}</td>
        <td>{actionFormatter(row.uri, row.id)}</td>
      </tr>)
    })
    return rows
  }

  return (
    <div id="search-results" className="row">
      <Alert text={error?.toString()} />
      <Alert text={useResourceError?.toString()} />
      <div className="col-sm-2"></div>
      <div className="col-sm-8">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="search-header" style={{ width: '45%' }}>
                Label
              </th>
              <th className="search-header" style={{ width: '40%' }}>
                Classes
              </th>
              <th className="search-header" style={{ width: '15%' }}/>
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
