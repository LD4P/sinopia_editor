// Copyright 2019 Stanford University see LICENSE for license
import { setSearchResults } from 'actions/index'
import { getSearchResultsWithFacets } from 'sinopiaSearch'
import { createLookupPromises } from 'utilities/QuestioningAuthority'
import { findAuthorityConfig } from 'utilities/authorityConfig'

export const fetchSinopiaSearchResults = (query, options) => (dispatch) => getSearchResultsWithFacets(query, options)
  .then(([response, facetResponse]) => {
    dispatch(setSearchResults('sinopia', response.results, response.totalHits, facetResponse, query, options, response.error))
  })

export const fetchQASearchResults = (query, uri, options = {}) => (dispatch) => {
  const result = findAuthorityConfig(uri)
  const searchPromise = createLookupPromises(query, [result], options)[0]

  return searchPromise.then((response) => {
    if (response.isError) {
      dispatch(setSearchResults(uri, [], 0, undefined, query, options, response.errorObject.message))
    } else {
      dispatch(setSearchResults(uri, response.body.results, response.body.response_header.total_records, undefined, query, options))
    }
  })
}
