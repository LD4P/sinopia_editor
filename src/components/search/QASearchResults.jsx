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
  const [resourceTemplateId, setResourceTemplateId] = useState(null)
  const [resourceN3, setResourceN3] = useState(null)
  const [resourceState, unusedDataset, useResourceError] = useResource(resourceN3, resourceURI, resourceTemplateId, rootResource, props.history)

  useEffect(() => {
    if (useResourceError && !error) {
      setError(useResourceError)
    }
  }, [useResourceError, error])

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
    getTerm(resourceURI, searchUri)
      .then(resourceN3 => setResourceN3(resourceN3))
      .catch(err => setError(`Error retrieving resource: ${err.toString()}`))
  }, [resourceURI, searchUri])

  // Transform the results into the format to be displayed in the table.
  const tableData = useMemo(() => searchResults.map((result) => {
    const classContext = result.context.find(context => context.property === 'Type')
    const classes = classContext ? classContext.values : []

    return {
      label: result.label,
      uri: result.uri,
      classes,
    }
  }),
  [searchResults])

  const handleCopy = (uri) => {
    setResourceURI(uri)
    setResourceTemplateId(null)
    dispatch(showModal('ResourceTemplateChoiceModal'))
  }

  // Passed into resource template chooser to allow it to pass back selected resource template id.
  const chooseResourceTemplate = (resourceTemplateId) => {
    setResourceTemplateId(resourceTemplateId)
  }

  function classFormatter(cell) {
    return (
      <ul className="list-unstyled">
        {cell.map(clazz => <li key={clazz}>{clazz}</li>)}
      </ul>
    )
  }

  function actionFormatter(cell) {
    return (
      <div>
        <button type="button"
                className="btn btn-link"
                onClick={() => handleCopy(cell)}
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
        <td>{classFormatter(row.classes)}</td>
        <td>{actionFormatter(row.uri)}</td>
      </tr>)
    })
    return rows
  }

  return (
    <div id="search-results" className="row">
      <Alert text={error?.toString()} />
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
