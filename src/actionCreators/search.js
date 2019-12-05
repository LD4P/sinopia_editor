// Copyright 2019 Stanford University see LICENSE for license
import { setSearchResults } from 'actions/index'
import { getSearchResultsWithFacets } from 'sinopiaSearch'
import { createLookupPromises } from 'utilities/QuestioningAuthority'
import { findAuthorityConfig } from 'utilities/authorityConfig'

export const fetchSinopiaSearchResults = (query, options) => (dispatch) => getSearchResultsWithFacets(query, options)
  .then(([response, facetResponse]) => {
    dispatch(setSearchResults('sinopia', response.results, response.totalHits, facetResponse, query, options, response.error))
  })

export const fetchQASearchResults = (query, uri, startOfRange = 0) => (dispatch) => {
  const result = findAuthorityConfig(uri)
  const searchPromise = createLookupPromises(query, [result])[0]

  return searchPromise.then((response) => {
    if (response.isError) {
      dispatch(setSearchResults(uri, [], 0, undefined, query, { startOfRange }, { message: response.errorObject.message }))
    } else {
      // Don't have total hits yet, so just using size of this response
      dispatch(setSearchResults(uri, response.body, response.body.length, undefined, query, { startOfRange }))
    }
  })
}
