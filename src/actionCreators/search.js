// Copyright 2019 Stanford University see LICENSE for license
import { getSearchResultsStarted, setSearchResults } from 'actions/index'
import { getSearchResults } from 'sinopiaServer'
import { createLookupPromises } from 'utilities/qa'

export const fetchSinopiaSearchResults = (query, queryFrom = 0) => (dispatch) => {
  dispatch(getSearchResultsStarted(query, queryFrom))

  return getSearchResults(query, queryFrom).then((response) => {
    dispatch(setSearchResults('sinopia', response.results, response.totalHits, query, queryFrom, response.error))
  })
}

export const fetchQASearchResults = (query, authority, queryFrom = 0) => (dispatch) => {
  dispatch(getSearchResultsStarted(query, queryFrom))

  const searchPromise = createLookupPromises(query, [{ authority }])[0]

  return searchPromise.then((response) => {
    if (response.isError) {
      dispatch(setSearchResults(authority, [], 0, query, queryFrom, { message: response.errorObject.message }))
    } else {
      // Don't have total hits yet, so just using size of this response
      dispatch(setSearchResults(authority, response.body, response.body.length, query, queryFrom))
    }
  })
}
