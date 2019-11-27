// Copyright 2019 Stanford University see LICENSE for license
import Config from 'Config'

/**
 * Sets state for search results.
 * @param {Object} state the previous redux state
 * @param {Object} action the payload of the action is the this of search results
 * @return {Object} the next redux state
 */
export const setSearchResults = (state, action) => {
  const newState = { ...state }

  newState.search = { ...state.search }
  newState.search.uri = action.payload.uri
  newState.search.results = action.payload.searchResults
  newState.search.totalResults = action.payload.totalResults
  newState.search.query = action.payload.query
  newState.search.options = { ...action.payload.options }
  if (newState.search.options.startOfRange === undefined) newState.search.options.startOfRange = 0
  if (newState.search.options.resultsPerPage === undefined) newState.search.options.resultsPerPage = Config.searchResultsPerPage
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
  newState.search = clearResults({ ...state.search })
  return newState
}

/**
 * Sets state for template search results.
 * @param {Object} state the previous redux state
 * @param {Object} action the payload of the action is the this of search results
 * @return {Object} the next redux state
 */
export const setTemplateSearchResults = (state, action) => {
  const newState = { ...state }
  newState.templateSearch = { ...state.templateSearch }
  newState.templateSearch.results = action.payload.searchResults
  newState.templateSearch.totalResults = action.payload.totalResults
  newState.templateSearch.options = { ...action.payload.options }
  if (newState.templateSearch.options.resultsPerPage === undefined) newState.templateSearch.options.resultsPerPage = Config.searchResultsPerPage

  newState.templateSearch.error = action.payload.error

  return newState
}

/**
 * Clears existing state related to template search results.
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const clearTemplateSearchResults = (state) => {
  const newState = { ...state }

  newState.templateSearch = clearResults({ ...state.templateSearch })
  return newState
}

const clearResults = (searchState) => {
  searchState.uri = undefined
  searchState.results = []
  searchState.totalResults = 0
  searchState.query = undefined
  searchState.options = {}
  searchState.options.startOfRange = 0
  searchState.options.sortField = undefined
  searchState.options.sortOrder = undefined
  searchState.options.resultsPerPage = Config.searchResultsPerPage,
  searchState.error = undefined
  return searchState
}
