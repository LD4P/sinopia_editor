// Copyright 2020 Stanford University see LICENSE for license

import React, {
  useState, useRef, useEffect,
} from 'react'
import PropTypes from 'prop-types'
import RenderLookupContext from './RenderLookupContext'
import _ from 'lodash'
import { getLookupResult } from 'utilities/Lookup'
import SearchResultsPaging from '../../search/SearchResultsPaging'
import Config from 'Config'

const LookupTab = (props) => {
  const [result, setResult] = useState(null)
  const [startOfRange, setStartOfRange] = useState(0)

  // Tokens allow us to cancel an existing search. Does not actually stop the
  // search, but causes result to be ignored.
  const tokens = useRef([])

  const query = props.query
  const authorityConfig = props.authorityConfig
  useEffect(() => {
    if (_.isEmpty(query)) return
    // Clear the results.
    // No re-render, so change not visible to user.
    setResult(null)
    setStartOfRange(0)

    // Cancel all current searches
    while (tokens.current.length > 0) {
      tokens.current.pop().cancel = true
    }

    // Create a token for this search
    const token = { cancel: false }
    tokens.current.push(token)

    getLookupResult(query, authorityConfig, 0)
      .then((result) => {
        // Only use these results if not cancelled.
        if (!token.cancel) {
          setResult(result)
        }
      })
  }, [query, authorityConfig])

  const handleChangePage = (newStartOfRange) => {
    setStartOfRange(newStartOfRange)
    performLookup(query, authorityConfig, newStartOfRange)
  }

  const performLookup = (query, authorityConfig, lookupStartOfRange) => {
    if (_.isEmpty(query)) return
    // Clear the results.
    // No re-render, so change not visible to user.
    setResult(null)

    // Cancel all current searches
    while (tokens.current.length > 0) {
      tokens.current.pop().cancel = true
    }

    // Create a token for this search
    const token = { cancel: false }
    tokens.current.push(token)

    getLookupResult(query, authorityConfig, lookupStartOfRange)
      .then((result) => {
        // Only use these results if not cancelled.
        if (!token.cancel) {
          setResult(result)
        }
      })
  }

  if (_.isEmpty(query)) return null

  if (!result) {
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Results Loading...</span>
      </div>
    )
  }

  if (!result.totalHits) {
    return (<span>No results</span>)
  }

  if (result.error) {
    return (<span className="dropdown-error">{result.error}</span>)
  }

  const tabResults = result.results.map((hit) => (<div key={hit.uri}>
    <button onClick={() => props.handleSelectionChanged(hit)} className="btn search-result">
      { hit.context ? (
        <RenderLookupContext innerResult={hit}
                             authLabel={authorityConfig.label}
                             authURI={authorityConfig.uri}></RenderLookupContext>
      ) : hit.label
      }
    </button>
  </div>))

  return (
    <React.Fragment>
      { tabResults }
      <SearchResultsPaging
        key="search-paging"
        resultsPerPage={Config.maxRecordsForQALookups}
        startOfRange={startOfRange}
        totalResults={result.totalHits}
        changePage={handleChangePage} />
    </React.Fragment>
  )
}

LookupTab.propTypes = {
  authorityConfig: PropTypes.object.isRequired,
  query: PropTypes.string,
  handleSelectionChanged: PropTypes.func.isRequired,
}

export default LookupTab
