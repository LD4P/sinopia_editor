// Copyright 2019 Stanford University see LICENSE for license

/**
 * Sets state for search results.
 * @param {Object} state the previous redux state
 * @param {Object} action the payload of the action is the this of search results
 * @return {Object} the next redux state
 */
export const setSearchResults = (state, action) => {
  const newState = { ...state }

  newState.search.uri = action.payload.uri
  newState.search.results = action.payload.searchResults
  newState.search.totalResults = action.payload.totalResults
  newState.search.query = action.payload.query
  newState.search.startOfRange = action.payload.startOfRange
  newState.search.error = action.payload.error

  return newState
}

/**
 * Clears existing state related to search results.
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const clearSearchResults = (state) => {
  const newState = { ...state }

  newState.search.uri = undefined
  newState.search.results = []
  newState.search.totalResults = 0
  newState.search.query = undefined
  newState.search.startOfRange = 0
  newState.search.error = undefined

  // Also clear retrieve resource error
  newState.editor.retrieveResourceError = undefined

  return newState
}
