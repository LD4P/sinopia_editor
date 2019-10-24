// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Config from 'Config'
import { getCurrentUser } from 'authSelectors'
import { copyNewResource } from 'actions/index'
import { retrieveResource } from 'actionCreators/resources'
import { rootResource } from 'selectors/resourceSelectors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faEdit } from '@fortawesome/free-solid-svg-icons'
import Alert from '../Alert'
import SinopiaSort from './SinopiaSort'

const SinopiaSearchResults = (props) => {
  const [navigateEditor, setNavigateEditor] = useState(false)

  const groupName = (uri) => {
    const groupSlug = uri.split('/')[1]
    return Config.groupsInSinopia[groupSlug]
  }

  const handleCopy = (resourceURI) => {
    props.retrieveResource(props.currentUser, resourceURI).then((success) => {
      props.copyNewResource({ uri: resourceURI })
      setNavigateEditor(success)
    })
  }

  const handleEdit = (resourceURI) => {
    props.retrieveResource(props.currentUser, resourceURI).then((success) => {
      setNavigateEditor(success)
    })
  }


  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && props.rootResource && !props.error) {
      props.history.push('/editor')
    }
  })

  // Generates an HTML row
  // TODO: Turn this function into a functional component
  const generateRows = () => {
    const rows = []
    props.searchResults.forEach((row) => {
      const link = `${Config.sinopiaServerBase}/${row.uri}`
      rows.push(<tr key={row.uri}>
        <td>{ row.label }</td>
        <td>
          <ul className="list-unstyled">
            { row.type?.map(type => <li key={type}>{type}</li>) }
          </ul>
        </td>
        <td>{ groupName(row.uri) }</td>
        <td>{ row.modified } </td>
        <td>
          <div className="btn-group" role="group" aria-label="Result Actions">
            <button className="btn btn-link"
                    title="Edit"
                    onClick={e => handleEdit(link, e) }>
              <FontAwesomeIcon icon={faEdit} size="2x" />
            </button>
            <button type="button"
                    className="btn btn-link"
                    onClick={() => handleCopy(link)}
                    title="Copy"
                    aria-label="Copy this resource">
              <FontAwesomeIcon icon={faCopy} size="2x" />
            </button>
          </div>
        </td>
      </tr>)
    })
    return rows
  }

  if (props.searchResults.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      <Alert text={props.error} />
      <div id="search-results" className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-8">
          <table className="table table-bordered" id="search-results-list">
            <thead>
              <tr>
                <th className="search-header" style={{ width: '35%' }}>
                  Title
                </th>
                <th className="search-header" style={{ width: '35%' }}>
                  Type
                </th>
                <th className="search-header" style={{ width: '25%' }}>
                  Institution
                </th>
                <th className="search-header" style={{ width: '5%' }}>
                  Modified
                </th>
                <th className="search-header">
                  <SinopiaSort />
                </th>
              </tr>
            </thead>
            <tbody>
              { generateRows() }
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  )
}

SinopiaSearchResults.propTypes = {
  searchResults: PropTypes.array,
  retrieveResource: PropTypes.func,
  currentUser: PropTypes.object,
  copyNewResource: PropTypes.func,
  history: PropTypes.object,
  rootResource: PropTypes.object,
  error: PropTypes.string,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  searchResults: state.selectorReducer.search.results,
  rootResource: rootResource(state),
  error: state.selectorReducer.editor.retrieveResourceError,
})

const mapDispatchToProps = dispatch => bindActionCreators({ retrieveResource, copyNewResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SinopiaSearchResults)
