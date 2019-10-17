// Copyright 2019 Stanford University see LICENSE for license
import { setSearchResults } from 'actions/index'
import { getSearchResults } from 'sinopiaSearch'
import { createLookupPromises } from 'utilities/qa'
import { findAuthorityConfig } from 'utilities/authorityConfig'

export const fetchSinopiaSearchResults = (query, queryFrom, resultsPerPage) => dispatch => getSearchResults(query, queryFrom, resultsPerPage).then((response) => {
  dispatch(setSearchResults('sinopia', response.results, response.totalHits, query, queryFrom, response.error))
})

export const fetchQASearchResults = (query, uri, queryFrom = 0) => (dispatch) => {
  const result = findAuthorityConfig(uri)
  const searchPromise = createLookupPromises(query, [result])[0]

  return searchPromise.then((response) => {
    if (response.isError) {
      dispatch(setSearchResults(uri, [], 0, query, queryFrom, { message: response.errorObject.message }))
    } else {
      // Don't have total hits yet, so just using size of this response
      dispatch(setSearchResults(uri, response.body, response.body.length, query, queryFrom))
    }
  })
}
