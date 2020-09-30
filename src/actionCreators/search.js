// Copyright 2019 Stanford University see LICENSE for license
import { setSearchResults } from 'actions/search'
import { getSearchResultsWithFacets } from 'sinopiaSearch'
import { createLookupPromises } from 'utilities/QuestioningAuthority'
import { findAuthorityConfig } from 'utilities/authorityConfig'
import { addSearchHistory } from 'actionCreators/user'

export const fetchSinopiaSearchResults = (query, options) => (dispatch) => getSearchResultsWithFacets(query, options)
  .then(([response, facetResponse]) => {
    dispatch(addSearchHistory('sinopia', query))
    dispatch(setSearchResults('resource', 'sinopia', response.results, response.totalHits, facetResponse || {}, query, options, response.error))
  })

export const fetchQASearchResults = (query, uri, options = {}) => (dispatch) => {
  const result = findAuthorityConfig(uri)
  const searchPromise = createLookupPromises(query, [result], options)[0]

  return searchPromise.then((response) => {
    if (response.isError) {
      dispatch(setSearchResults('resource', uri, [], 0, {}, query, options, response.errorObject.message))
    } else {
      dispatch(addSearchHistory(uri, query))
      dispatch(setSearchResults('resource', uri, response.body.results, response.body.response_header.total_records,
        {}, query, options))
    }
  })
}
