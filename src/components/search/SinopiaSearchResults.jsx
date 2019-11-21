// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import Config from 'Config'
import { getCurrentUser } from 'authSelectors'
import { retrieveResource } from 'actionCreators/resources'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faEdit } from '@fortawesome/free-solid-svg-icons'
import { findResource, findErrors } from 'selectors/resourceSelectors'
import Alerts from '../Alerts'
import SinopiaSort from './SinopiaSort'
import LongDate from 'components/LongDate'
import _ from 'lodash'

// Errors from retrieving a resource from this page.
export const searchRetrieveErrorKey = 'searchresource'

const SinopiaSearchResults = (props) => {
  const [navigateEditor, setNavigateEditor] = useState(false)

  const errorsRef = useRef(null)

  const groupName = (uri) => {
    const groupSlug = uri.split('/')[4]
    return Config.groupsInSinopia[groupSlug]
  }

  const handleCopy = (resourceURI) => {
    props.retrieveResource(props.currentUser, resourceURI, searchRetrieveErrorKey, true).then((success) => {
      setNavigateEditor(success)
    })
  }

  const handleEdit = (resourceURI) => {
    props.retrieveResource(props.currentUser, resourceURI, searchRetrieveErrorKey).then((success) => {
      setNavigateEditor(success)
    })
  }

  useEffect(() => {
    // Forces a wait until the resource has been set in state
    if (navigateEditor && props.rootResource && _.isEmpty(props.errors)) {
      props.history.push('/editor')
    }
    else if (!_.isEmpty(props.errors))
    {
      window.scrollTo(0, errorsRef.current.offsetTop)
    }
  })

  // Generates an HTML row
  // TODO: Turn this function into a functional component
  const generateRows = () => {
    const rows = []
    props.searchResults.forEach((row) => {
      rows.push(<tr key={row.uri}>
        <td>{ row.label }</td>
        <td>
          <ul className="list-unstyled">
            { row.type?.map(type => <li key={type}>{type}</li>) }
          </ul>
        </td>
        <td>{ groupName(row.uri) }</td>
        <td><LongDate datetime={ row.modified } /></td>
        <td>
          <div className="btn-group" role="group" aria-label="Result Actions">
            <button className="btn btn-link"
                    title="Edit"
                    onClick={e => handleEdit(row.uri, e) }>
              <FontAwesomeIcon icon={faEdit} className="icon-lg" />
            </button>
            <button type="button"
                    className="btn btn-link"
                    onClick={() => handleCopy(row.uri)}
                    title="Copy"
                    aria-label="Copy this resource">
              <FontAwesomeIcon icon={faCopy} className="icon-lg" />
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
      <div ref={errorsRef}><Alerts errorKey={searchRetrieveErrorKey} /></div>
      <div id="search-results" className="row">
        <div className="col">
          <table className="table table-bordered" id="search-results-list">
            <thead>
              <tr>
                <th className="search-header" style={{ width: '35%' }}>
                  Label
                </th>
                <th className="search-header" style={{ width: '35%' }}>
                  Class
                </th>
                <th className="search-header" style={{ width: '25%' }}>
                  Institution
                </th>
                <th className="search-header" style={{ width: '5%' }}>
                  Modified Date
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
  history: PropTypes.object,
  rootResource: PropTypes.object,
  errors: PropTypes.array,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  searchResults: state.selectorReducer.search.results,
  rootResource: findResource(state),
  errors: findErrors(state, searchRetrieveErrorKey),
})

const mapDispatchToProps = dispatch => bindActionCreators({ retrieveResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SinopiaSearchResults)
