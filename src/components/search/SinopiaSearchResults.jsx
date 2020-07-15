// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { selectCurrentUser } from 'selectors/authenticate'
import { loadResource, newResource2 } from 'actionCreators/resources'
import { selectErrors } from 'selectors/errors'
import Alerts from '../Alerts'
import TypeFilter from './TypeFilter'
import GroupFilter from './GroupFilter'
import SearchResultRows from './SearchResultRows'
import SinopiaSort from './SinopiaSort'
import _ from 'lodash'
import { selectCurrentResource } from 'selectors/resources'

// Errors from retrieving a resource from this page.
export const searchRetrieveErrorKey = 'searchresource'

const SinopiaSearchResults = (props) => {
  const [navigateEditor, setNavigateEditor] = useState(false)

  const errorsRef = useRef(null)

  const handleCopy = (resourceURI) => {
    props.loadResource(props.currentUser, resourceURI, searchRetrieveErrorKey, true).then((success) => {
      setNavigateEditor(success)
    })
  }

  const handleEdit = (resourceURI) => {
    props.loadResource(props.currentUser, resourceURI, searchRetrieveErrorKey).then((success) => {
      setNavigateEditor(success)
    })
  }

  const handleRT = (resourceURI) => {
    console.log('resourceURI', resourceURI)
    props.newResource2(props.currentUser, resourceURI, searchRetrieveErrorKey).then((success) => {
      setNavigateEditor(success)
    })
  }

  useEffect(() => {
    // Forces a wait until the resource has been set in state
    if (navigateEditor && props.currentResource && _.isEmpty(props.errors)) {
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
                  Label / ID
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
              <SearchResultRows searchResults={props.searchResults} handleEdit={handleEdit} handleCopy={handleCopy} handleRT={handleRT}/>
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  )
}

SinopiaSearchResults.propTypes = {
  searchResults: PropTypes.array,
  loadResource: PropTypes.func,
  currentUser: PropTypes.object,
  history: PropTypes.object,
  currentResource: PropTypes.object,
  errors: PropTypes.array,
  fetchSinopiaSearchResults: PropTypes.func,
  newResource2: PropTypes.func,
}

const mapStateToProps = (state) => ({
  currentUser: selectCurrentUser(state),
  searchResults: state.selectorReducer.search.results,
  currentResource: selectCurrentResource(state),
  errors: selectErrors(state, searchRetrieveErrorKey),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ loadResource, newResource2 }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SinopiaSearchResults)
