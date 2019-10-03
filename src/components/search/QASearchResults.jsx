// Copyright 2019 Stanford University see LICENSE for license

import React, { useMemo, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import { showResourceTemplateChooser as showResourceTemplateChooserAction } from 'actions/index'
import ResourceTemplateChoiceModal from '../ResourceTemplateChoiceModal'
import { getTerm } from 'utilities/qa'
import { existingResource as existingResourceAction } from 'actionCreators/resources'
import { rootResource as rootResourceSelector } from 'selectors/resourceSelectors'
import useResource from 'hooks/useResource'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'

const QASearchResults = (props) => {
  const dispatch = useDispatch()
  const showResourceTemplateChooser = () => dispatch(showResourceTemplateChooserAction())
  const existingResource = (state, unusedRDF) => dispatch(existingResourceAction(state, unusedRDF))

  const searchResults = useSelector(state => state.selectorReducer.search.results)
  const authority = useSelector(state => state.selectorReducer.search.authority)
  const rootResource = useSelector(state => rootResourceSelector(state))

  const [error, setError] = useState(null)
  const [resourceURI, setResourceURI] = useState(null)
  const [resourceTemplateId, setResourceTemplateId] = useState(null)
  const [resourceN3, setResourceN3] = useState(null)
  const [state, unusedDataset, useResourceError] = useResource(resourceN3, resourceURI, resourceTemplateId, rootResource, props.history)
  if (useResourceError && !error) {
    setError(useResourceError)
  }
  if (state && unusedDataset) {
    existingResource(state, unusedDataset.toCanonical())
  }

  // Retrieve N3 from QA
  useEffect(() => {
    if (!resourceURI || !authority) {
      return
    }
    getTerm(resourceURI, authority)
      .then(resourceN3 => setResourceN3(resourceN3))
      .catch(err => setError(`Error retrieving resource: ${err.toString()}`))
  }, [resourceURI, authority])

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
    showResourceTemplateChooser()
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

  const columns = [
    {
      dataField: 'label',
      text: 'Label',
      sort: false,
      headerStyle: { backgroundColor: '#F8F6EF', width: '45%' },
    },
    {
      dataField: 'classes',
      text: 'Classes',
      sort: false,
      headerStyle: { backgroundColor: '#F8F6EF', width: '40%' },
      formatter: classFormatter,
    },
    {
      dataField: 'uri',
      text: '',
      sort: false,
      headerStyle: { backgroundColor: '#F8F6EF', width: '15%' },
      formatter: actionFormatter,
    }]

  return (
    <div id="search-results" className="row">
      { error
        && <div className="row">
          <div className="col-md-12" style={{ marginTop: '10px' }}>
            <div className="alert alert-danger alert-dismissible">
              <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
              { error.toString() }
            </div>
          </div>
        </div>
      }
      <div className="col-sm-2"></div>
      <div className="col-sm-8">
        <BootstrapTable id="search-results-list" keyField="uri" data={ tableData } columns={ columns } />
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
