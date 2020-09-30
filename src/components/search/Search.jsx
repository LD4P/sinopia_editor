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
import { clearSearchResults as clearSearchResultsAction, setSearchResults } from 'actions/search'
import SinopiaSearchResults from './SinopiaSearchResults'
import QASearchResults from './QASearchResults'
import SearchResultsPaging from './SearchResultsPaging'
import SearchResultsMessage from './SearchResultsMessage'
import Alert from '../Alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons'
import searchConfig from '../../../static/searchConfig.json'
import {
  selectSearchError, selectSearchQuery, selectSearchUri, selectSearchOptions,
} from 'selectors/search'

const Search = (props) => {
  const dispatch = useDispatch()

  const searchOptions = useSelector((state) => selectSearchOptions(state, 'resource'))
  const error = useSelector((state) => selectSearchError(state, 'resource'))
  const searchUri = useSelector((state) => selectSearchUri(state, 'resource'))
  const lastQueryString = useSelector((state) => selectSearchQuery(state, 'resource'))

  const clearSearchResults = useCallback(() => dispatch(clearSearchResultsAction('resource')), [dispatch])

  const topRef = useRef(null)

  const defaultUri = 'sinopia'

  const [queryString, setQueryString] = useState(lastQueryString || '')
  const [uri, setUri] = useState(searchUri || defaultUri)

  useEffect(() => {
    if (!queryString) clearSearchResults()
  }, [clearSearchResults, queryString])

  const fetchQASearchResults = (queryString, uri, startOfRange) => {
    dispatch(fetchQASearchResultsCreator(queryString, uri, { ...searchOptions, startOfRange })).then((response) => {
      if (response) dispatch(setSearchResults('resource', uri, response.results, response.totalHits, {}, queryString, { startOfRange }, response.error))
    })
  }

  const fetchSinopiaSearchResults = (queryString, startOfRange) => {
    dispatch(fetchSinopiaSearchResultsCreator(queryString, { ...searchOptions, startOfRange })).then((response) => {
      if (response) dispatch(setSearchResults('resource', null, response.results, response.totalHits, {}, queryString, { startOfRange }, response.error))
    })
  }

  const fetchNewSinopiaSearchResults = (queryString) => {
    dispatch(fetchSinopiaSearchResultsCreator(queryString)).then((response) => {
      if (response) dispatch(setSearchResults('resource', null, response.results, response.totalHits, {}, queryString, {}, response.error))
    })
  }

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
    if (uri === defaultUri) {
      fetchNewSinopiaSearchResults(queryString)
    } else {
      fetchQASearchResults(queryString, uri, 0)
    }
    if (error && topRef.current) window.scrollTo(0, topRef.current.offsetTop)
  }

  const changeSinopiaSearchPage = (startOfRange) => {
    fetchSinopiaSearchResults(queryString, startOfRange)
  }

  const changeQASearchPage = (startOfRange) => {
    fetchQASearchResults(queryString, uri, startOfRange)
  }

  const options = searchConfig.map((config) => (<option key={config.uri} value={config.uri}>{config.label}</option>))

  let results
  if (searchUri === defaultUri) {
    results = (
      <div>
        <SinopiaSearchResults {...props} key="search-results" />
        <SearchResultsPaging key="search-paging" searchType="resource" changePage={changeSinopiaSearchPage} />
        <SearchResultsMessage />
      </div>
    )
  } else if (searchUri) {
    results = (
      <div>
        <QASearchResults history={props.history} key="search-results" />
        <SearchResultsPaging key="search-paging" searchType="resource" changePage={changeQASearchPage} />
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
                <option value={defaultUri}>Sinopia</option>
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
                       onKeyPress={handleKeyPress}
                       placeholder="Enter query string"
                       value={ queryString } />
                <span className="input-group-btn">
                  <button className="btn btn-default"
                          type="submit"
                          title="Submit search"
                          aria-label="Submit search"
                          data-testid="Submit search">
                    <FontAwesomeIcon className="fa-search" icon={faSearch} />
                  </button>
                  <button className="btn btn-default"
                          type="button"
                          aria-label="Clear query string"
                          title="Clear query string"
                          data-testid="Clear query string"
                          onClick={() => {
                            setQueryString('')
                            setUri(defaultUri)
                            clearSearchResults()
                          } }>
                    <FontAwesomeIcon className="trash-icon" icon={faTrashAlt} />
                  </button>
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
