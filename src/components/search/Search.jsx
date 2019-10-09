// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Header from '../Header'
import {
  fetchSinopiaSearchResults as fetchSinopiaSearchResultsCreator,
  fetchQASearchResults as fetchQASearchResultsCreator,
} from 'actionCreators/search'
import { clearRetrieveResourceError as clearRetrieveResourceErrorAction, clearSearchResults as clearSearchResultsAction } from 'actions/index'
import SinopiaSearchResults from './SinopiaSearchResults'
import QASearchResults from './QASearchResults'
import SearchResultsPaging from './SearchResultsPaging'
import SearchResultsMessage from './SearchResultsMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import searchConfig from '../../../static/searchConfig.json'


const Search = (props) => {
  const dispatch = useDispatch()
  const fetchQASearchResults = (queryString, uri) => dispatch(fetchQASearchResultsCreator(queryString, uri))
  const fetchSinopiaSearchResults = queryString => dispatch(fetchSinopiaSearchResultsCreator(queryString))
  const clearRetrieveResourceError = () => dispatch(clearRetrieveResourceErrorAction())
  const clearSearchResults = useCallback(() => dispatch(clearSearchResultsAction()), [dispatch])

  const error = useSelector(state => state.selectorReducer.search.error)
  const searchUri = useSelector(state => state.selectorReducer.search.uri)

  const [queryString, setQueryString] = useState('')
  const [uri, setUri] = useState('sinopia')

  useEffect(() => {
    clearSearchResults()
  }, [clearSearchResults])

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search()
      event.preventDefault()
    }
  }

  const handleSubmit = (event) => {
    search()
    event.preventDefault()
  }

  const search = () => {
    if (queryString === '') {
      return
    }
    clearRetrieveResourceError()
    if (uri === 'sinopia') {
      fetchSinopiaSearchResults(queryString)
    } else {
      fetchQASearchResults(queryString, uri)
    }
  }

  const options = searchConfig.map(config => (<option key={config.uri} value={config.uri}>{config.label}</option>))

  let results
  if (searchUri === 'sinopia') {
    results = (
      <div>
        <SinopiaSearchResults {...props} key="search-results" />
        <SearchResultsPaging {...props} key="search-paging" pageSize="1"/>
        <SearchResultsMessage />
      </div>
    )
  } else if (searchUri) {
    results = (
      <QASearchResults history={props.history} key="search-results" />
    )
  }

  return (
    <div id="search">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
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
      <div className="row">
        <form className="form-inline" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="searchType">Search</label>&nbsp;
            <select className="form-control" id="searchType"
                    value={uri}
                    onChange={ event => setUri(event.target.value) }
                    onBlur={ event => setUri(event.target.value) }>
              <option value="sinopia">Sinopia</option>
              {options}
            </select>
          </div>
          <div className="form-group" style={{ width: '750px', paddingLeft: '5px' }}>
            <label className="sr-only" htmlFor="searchInput">Query</label>
            <div className="input-group" style={{ width: '100%' }}>
              <input id="searchInput" type="text" className="form-control"
                     onChange={ event => setQueryString(event.target.value) }
                     onKeyPress={handleKeyPress} />
              <span className="input-group-btn">
                <button className="btn btn-default" type="submit" aria-label="submit search"><FontAwesomeIcon className="fa-search" icon={faSearch} /></button>
              </span>
            </div>
          </div>
        </form>
      </div>
      <span className="help-block">For searching Sinopia, use a * to wildcard your search.</span>
      {results}
    </div>
  )
}

Search.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  currentUser: PropTypes.object,
  history: PropTypes.object,
}

export default Search
