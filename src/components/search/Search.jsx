// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Header from '../Header'
import Alert from 'react-bootstrap/lib/Alert'
import { fetchSinopiaSearchResults, fetchQASearchResults } from 'actionCreators/search'
import SinopiaSearchResults from './SinopiaSearchResults'
import QASearchResults from './QASearchResults'
import SearchResultsPaging from './SearchResultsPaging'
import SearchResultsMessage from './SearchResultsMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import searchConfig from '../../../static/searchConfig.json'

const Search = (props) => {
  const [queryString, setQueryString] = useState('')
  const [showAlert, setShowAlert] = useState(props.error)
  const [authority, setAuthority] = useState('sinopia')

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
    if (authority === 'sinopia') {
      props.fetchSinopiaSearchResults(queryString)
    } else {
      props.fetchQASearchResults(queryString, authority)
    }
  }

  let alert

  if (showAlert) {
    alert = (
      <Alert key="0" bsStyle="warning">
        <button className="close" aria-label="close" onClick={() => setShowAlert(false)}>&times;</button>
        {props.error.message}
      </Alert>
    )
  }

  useEffect(() => {
    setShowAlert(props.error)
  }, [props.error])

  const options = searchConfig.map(config => (<option key={config.authority} value={config.authority}>{config.label}</option>))

  let results
  if (props.resultAuthority === 'sinopia') {
    results = (
      <div>
        <SinopiaSearchResults {...props} key="search-results" />
        <SearchResultsPaging {...props} key="search-paging" pageSize="1"/>
        <SearchResultsMessage />
      </div>
    )
  } else if (props.resultAuthority) {
    results = (
      <QASearchResults key="search-results" />
    )
  }

  return (
    <div id="search">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      {alert}
      <div className="row">
        <form className="form-inline" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="searchType">Search</label>&nbsp;
            <select className="form-control" id="searchType"
                    value={authority}
                    onChange={ event => setAuthority(event.target.value) }
                    onBlur={ event => setAuthority(event.target.value) }>
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
  fetchSinopiaSearchResults: PropTypes.func,
  fetchQASearchResults: PropTypes.func,
  currentUser: PropTypes.object,
  query: PropTypes.string,
  error: PropTypes.object,
  resultAuthority: PropTypes.string,
}

const mapDispatchToProps = dispatch => bindActionCreators({ fetchSinopiaSearchResults, fetchQASearchResults }, dispatch)

const mapStateToProps = state => ({
  query: state.selectorReducer.search.query,
  error: state.selectorReducer.search.error,
  resultAuthority: state.selectorReducer.search.authority,
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
