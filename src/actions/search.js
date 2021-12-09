export const clearSearchResults = (searchType) => ({
  type: "CLEAR_SEARCH_RESULTS",
  payload: searchType,
})

export const setSearchResults = (
  searchType,
  uri,
  results,
  totalResults,
  facetResults,
  query,
  options,
  error
) => ({
  type: "SET_SEARCH_RESULTS",
  payload: {
    searchType,
    uri,
    results,
    totalResults,
    facetResults,
    query,
    options,
    error,
  },
})

export const setHeaderSearch = (uri, query) => ({
  type: "SET_HEADER_SEARCH",
  payload: {
    uri,
    query,
  },
})
