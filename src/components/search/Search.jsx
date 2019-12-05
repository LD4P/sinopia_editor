// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Header from '../Header'
import {
  fetchSinopiaSearchResults as fetchSinopiaSearchResultsCreator,
  fetchQASearchResults as fetchQASearchResultsCreator,
} from 'actionCreators/search'
import { clearSearchResults as clearSearchResultsAction } from 'actions/index'
import SinopiaSearchResults from './SinopiaSearchResults'
import QASearchResults from './QASearchResults'
import SearchResultsPaging from './SearchResultsPaging'
import SearchResultsMessage from './SearchResultsMessage'
import Alert from '../Alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import searchConfig from '../../../static/searchConfig.json'

const Search = (props) => {
  const dispatch = useDispatch()
  const fetchQASearchResults = (queryString, uri, startOfRange) => dispatch(fetchQASearchResultsCreator(queryString, uri, { ...searchOptions, startOfRange }))

  const searchOptions = useSelector((state) => state.selectorReducer.search.options)

  const fetchSinopiaSearchResults = (queryString, startOfRange) => dispatch(fetchSinopiaSearchResultsCreator(
    queryString, { ...searchOptions, startOfRange },
  ))

  const fetchNewSinopiaSearchResults = (queryString) => dispatch(fetchSinopiaSearchResultsCreator(
    queryString,
  ))


  const clearSearchResults = useCallback(() => dispatch(clearSearchResultsAction()), [dispatch])

  const error = useSelector((state) => state.selectorReducer.search.error)
  const searchUri = useSelector((state) => state.selectorReducer.search.uri)

  const topRef = useRef(null)

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
    if (uri === 'sinopia') {
      fetchNewSinopiaSearchResults(queryString)
    } else {
      fetchQASearchResults(queryString, uri, 0)
    }
    if (error) window.scrollTo(0, topRef.current.offsetTop)
  }

  const changeSinopiaSearchPage = (startOfRange) => {
    fetchSinopiaSearchResults(queryString, startOfRange)
  }

  const changeQASearchPage = (startOfRange) => {
    fetchQASearchResults(queryString, uri, startOfRange)
  }

  const options = searchConfig.map((config) => (<option key={config.uri} value={config.uri}>{config.label}</option>))

  let results
  if (searchUri === 'sinopia') {
    results = (
      <div>
        <SinopiaSearchResults {...props} key="search-results" />
        <SearchResultsPaging key="search-paging" path="search" changePage={changeSinopiaSearchPage} />
        <SearchResultsMessage />
      </div>
    )
  } else if (searchUri) {
    results = (
      <div>
        <QASearchResults history={props.history} key="search-results" />
        <SearchResultsPaging key="search-paging" path="search" changePage={changeQASearchPage} />
        <SearchResultsMessage />
      </div>
    )
  }

  return (
    <div id="search" ref={topRef}>
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <Alert text={error && `An error occurred while searching: ${error.toString()}`} />
      <div className="row">
        <div className="col">
          <form className="form-inline" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="searchType">Search</label>&nbsp;
              <select className="form-control" id="searchType"
                      value={uri}
                      onChange={ (event) => setUri(event.target.value) }
                      onBlur={ (event) => setUri(event.target.value) }>
                <option value="sinopia">Sinopia</option>
                {options}
              </select>
            </div>
            <div className="form-group" style={{
              width: '750px', marginTop: '10px', paddingLeft: '5px', paddingBottom: '10px',
            }}>
              <label className="sr-only" htmlFor="searchInput">Query</label>
              <div className="input-group" style={{ width: '100%' }}>
                <input id="searchInput" type="text" className="form-control"
                       onChange={ (event) => setQueryString(event.target.value) }
                       onKeyPress={handleKeyPress} />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="submit" aria-label="submit search"><FontAwesomeIcon className="fa-search" icon={faSearch} /></button>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="row" style={{ marginBottom: '10px' }}>
        <div className="col">
          <span className="text-muted">Sinopia search: use * as wildcard;
            default operator for multiple terms is AND; use | (pipe) as OR operator;
            use quotation marks for exact match. For more details see <a href="https://github.com/LD4P/sinopia/wiki/Searching-in-Sinopia">Searching in Sinopia</a>.
          </span>
        </div>
      </div>
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
