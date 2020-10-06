// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Header from '../Header'
import { clearSearchResults as clearSearchResultsAction } from 'actions/search'
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
  selectSearchTotalResults,
} from 'selectors/search'
import { sinopiaSearchUri } from 'utilities/authorityConfig'
import useSearch from 'hooks/useSearch'

const Search = (props) => {
  const dispatch = useDispatch()
  const { fetchSearchResults, fetchNewSearchResults } = useSearch()

  const searchOptions = useSelector((state) => selectSearchOptions(state, 'resource'))
  const error = useSelector((state) => selectSearchError(state, 'resource'))
  const searchUri = useSelector((state) => selectSearchUri(state, 'resource'))
  const lastQueryString = useSelector((state) => selectSearchQuery(state, 'resource'))
  const totalResults = useSelector((state) => selectSearchTotalResults(state, 'resource'))

  const clearSearchResults = useCallback(() => dispatch(clearSearchResultsAction('resource')), [dispatch])

  const topRef = useRef(null)
  const loadingSearchRef = useRef(null)

  const [queryString, setQueryString] = useState(lastQueryString || '')
  const [uri, setUri] = useState(searchUri || sinopiaSearchUri)

  useEffect(() => {
    if (!queryString) clearSearchResults()
  }, [clearSearchResults, queryString])

  useEffect(() => {
    if (lastQueryString) setQueryString(lastQueryString)
  }, [lastQueryString, setQueryString])

  useEffect(() => {
    if (searchUri) setUri(searchUri)
  }, [searchUri, setUri])

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
    fetchNewSearchResults(queryString, uri)
    if (loadingSearchRef.current) loadingSearchRef.current.classList.remove('hidden')
    clearSearchResults()
    if (error && topRef.current) window.scrollTo(0, topRef.current.offsetTop)
  }

  const changeSinopiaSearchPage = (startOfRange) => {
    fetchSearchResults(queryString, sinopiaSearchUri, searchOptions, startOfRange)
  }

  const changeQASearchPage = (startOfRange) => {
    fetchSearchResults(queryString, uri, searchOptions, startOfRange)
  }

  const options = searchConfig.map((config) => (<option key={config.uri} value={config.uri}>{config.label}</option>))

  let results

  if (searchUri === sinopiaSearchUri) {
    if (loadingSearchRef.current) loadingSearchRef.current.classList.add('hidden')
    results = (
      <div>
        <SinopiaSearchResults {...props} key="search-results" />
        <SearchResultsPaging
          key="search-paging"
          resultsPerPage={searchOptions.resultsPerPage}
          startOfRange={searchOptions.startOfRange}
          totalResults={totalResults}
          changePage={changeSinopiaSearchPage} />
        <SearchResultsMessage />
      </div>
    )
  } else if (searchUri) {
    if (loadingSearchRef.current) loadingSearchRef.current.classList.add('hidden')
    results = (
      <div>
        <QASearchResults history={props.history} key="search-results" />
        <SearchResultsPaging
          key="search-paging"
          resultsPerPage={searchOptions.resultsPerPage}
          startOfRange={searchOptions.startOfRange}
          totalResults={totalResults}
          changePage={changeQASearchPage} />
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
                <option value={sinopiaSearchUri}>Sinopia</option>
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
                            setUri(sinopiaSearchUri)
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
      <div ref={loadingSearchRef} id="search-results-loading" className="hidden text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Results Loading...</span>
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
