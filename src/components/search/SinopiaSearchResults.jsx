// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { showModal } from 'actions/modals'
import { loadResource } from 'actionCreators/resources'
import { selectErrors } from 'selectors/errors'
import { selectCurrentResourceKey } from 'selectors/resources'
import { selectSearchResults } from 'selectors/search'
import Alerts from '../Alerts'
import TypeFilter from './TypeFilter'
import GroupFilter from './GroupFilter'
import SearchResultRows from './SearchResultRows'
import SinopiaSort from './SinopiaSort'
import ViewResourceModal from '../ViewResourceModal'
import _ from 'lodash'

// Errors from retrieving a resource from this page.
export const searchRetrieveErrorKey = 'searchresource'

const SinopiaSearchResults = (props) => {
  const [navigateEditor, setNavigateEditor] = useState(false)

  const errorsRef = useRef(null)

  const searchResults = useSelector((state) => selectSearchResults(state, 'resource'))
  const currentResourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const errors = useSelector((state) => selectErrors(state, searchRetrieveErrorKey))

  const dispatch = useDispatch()

  const handleCopy = (resourceURI) => {
    dispatch(loadResource(resourceURI, searchRetrieveErrorKey, true)).then((success) => {
      setNavigateEditor(success)
    })
  }

  const handleEdit = (resourceURI) => {
    dispatch(loadResource(resourceURI, searchRetrieveErrorKey)).then((success) => {
      setNavigateEditor(success)
    })
  }

  const handleView = (resourceURI) => {
    dispatch(loadResource(resourceURI, searchRetrieveErrorKey, false, true)).then(() => {
      dispatch(showModal('ViewResourceModal'))
    })
  }

  useEffect(() => {
    // Forces a wait until the resource has been set in state
    if (navigateEditor && currentResourceKey && _.isEmpty(errors)) {
      props.history.push('/editor')
    }
    else if (!_.isEmpty(errors)) {
      window.scrollTo(0, errorsRef.current.offsetTop)
    }
  })

  if (searchResults.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      <ViewResourceModal handleEdit={handleEdit} handleCopy={handleCopy} />
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
              <SearchResultRows searchResults={searchResults}
                                handleEdit={handleEdit}
                                handleCopy={handleCopy}
                                handleView={handleView} />
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  )
}

SinopiaSearchResults.propTypes = {
  history: PropTypes.object,
}

export default SinopiaSearchResults
