import { defaultSearchResultsPerPage } from "utilities/Search"

export const selectSearchError = (state, searchType) =>
  state.search[searchType]?.error

export const selectSearchUri = (state, searchType) =>
  state.search[searchType]?.uri

export const selectSearchQuery = (state, searchType) =>
  state.search[searchType]?.query

export const selectSearchTotalResults = (state, searchType) =>
  state.search[searchType]?.totalResults || 0

export const selectSearchFacetResults = (state, searchType, facetType) =>
  state.search[searchType]?.facetResults[facetType]

export const selectSearchOptions = (state, searchType) =>
  state.search[searchType]?.options || {
    startOfRange: 0,
    resultsPerPage: defaultSearchResultsPerPage(searchType),
  }

export const selectSearchResults = (state, searchType) =>
  state.search[searchType]?.results
