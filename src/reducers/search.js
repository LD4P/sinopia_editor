// Copyright 2019 Stanford University see LICENSE for license
import { defaultSearchResultsPerPage } from "utilities/Search"

/**
 * Sets state for search results.
 * @param {Object} state the previous redux state
 * @param {Object} action the payload of the action is the this of search results
 * @return {Object} the next redux state
 */
export const setSearchResults = (state, action) => ({
  ...state,
  [action.payload.searchType]: {
    uri: action.payload.uri,
    results: action.payload.results,
    totalResults: action.payload.totalResults,
    facetResults: action.payload.facetResults || {},
    relationshipResults: {},
    query: action.payload.query,
    options: {
      resultsPerPage:
        action.payload.options?.resultsPerPage ||
        defaultSearchResultsPerPage(action.payload.searchType),
      startOfRange: action.payload.options?.startOfRange || 0,
      sortField: action.payload.options?.sortField,
      sortOrder: action.payload.options?.sortOrder,
      typeFilter: action.payload.options?.typeFilter,
      groupFilter: action.payload.options?.groupFilter,
    },
    error: action.payload.error,
  },
})

/**
 * Clears existing state related to search results.
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const clearSearchResults = (state, action) => ({
  ...state,
  [action.payload]: null,
})

export const setHeaderSearch = (state, action) => ({
  ...state,
  currentHeaderSearch: action.payload,
})
