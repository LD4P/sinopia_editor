// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { getCurrentUser } from 'authSelectors'
import { retrieveResource } from 'actionCreators/resources'
import { findResource, findErrors } from 'selectors/resourceSelectors'
import Alerts from '../Alerts'
import TypeFilter from './TypeFilter'
import GroupFilter from './GroupFilter'
import SearchResultRows from './SearchResultRows'
import SinopiaSort from './SinopiaSort'
import _ from 'lodash'


// Errors from retrieving a resource from this page.
export const searchRetrieveErrorKey = 'searchresource'

const SinopiaSearchResults = (props) => {
  const [navigateEditor, setNavigateEditor] = useState(false)

  const errorsRef = useRef(null)

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

  if (props.searchResults.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      <div ref={errorsRef}><Alerts errorKey={searchRetrieveErrorKey} /></div>
      <div className="row">
        <div className="col" style={{ marginBottom: '5px' }}>
          <TypeFilter />
          <GroupFilter />
        </div>
      </div>
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
                <th className="search-header" style={{ width: '20%' }}>
                  Institution
                </th>
                <th className="search-header" style={{ width: '10%' }}>
                  Modified
                </th>
                <th className="search-header">
                  <SinopiaSort />
                </th>
              </tr>
            </thead>
            <tbody>
              <SearchResultRows searchResults={props.searchResults} handleEdit={handleEdit} handleCopy={handleCopy} />
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
  fetchSinopiaSearchResults: PropTypes.func,
}

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state),
  searchResults: state.selectorReducer.search.results,
  rootResource: findResource(state),
  errors: findErrors(state, searchRetrieveErrorKey),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ retrieveResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SinopiaSearchResults)
