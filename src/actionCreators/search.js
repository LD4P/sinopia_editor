// Copyright 2019 Stanford University see LICENSE for license
import { setSearchResults } from 'actions/index'
import { getSearchResults } from 'sinopiaSearch'
import { createLookupPromises } from 'utilities/qa'
import { findAuthorityConfig } from 'utilities/authorityConfig'

// eslint-disable-next-line max-params
export const fetchSinopiaSearchResults = (query, queryFrom, resultsPerPage, sortField, sortOrder) => dispatch => getSearchResults(
  query, queryFrom, resultsPerPage, sortField, sortOrder,
).then((response) => {
  dispatch(setSearchResults('sinopia', response.results, response.totalHits, query, queryFrom, sortField, sortOrder, response.error))
})

export const fetchQASearchResults = (query, uri, queryFrom = 0) => (dispatch) => {
  const result = findAuthorityConfig(uri)
  const searchPromise = createLookupPromises(query, [result])[0]

  return searchPromise.then((response) => {
    if (response.isError) {
      dispatch(setSearchResults(uri, [], 0, query, queryFrom, undefined, undefined, { message: response.errorObject.message }))
    } else {
      // Don't have total hits yet, so just using size of this response
      dispatch(setSearchResults(uri, response.body, response.body.length, query, queryFrom))
    }
  })
}
