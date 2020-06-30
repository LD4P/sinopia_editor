export const clearSearchResults = () => ({
  type: 'CLEAR_SEARCH_RESULTS',
})

export const clearTemplateSearchResults = () => ({
  type: 'CLEAR_TEMPLATE_SEARCH_RESULTS',
})

export const setSearchResults = (uri, searchResults, totalResults, facetResults, query, options, error) => ({
  type: 'SET_SEARCH_RESULTS',
  payload: {
    uri,
    searchResults,
    totalResults,
    facetResults,
    query,
    options,
    error,
  },
})

export const setTemplateSearchResults = (searchResults, totalResults, options, error) => ({
  type: 'SET_TEMPLATE_SEARCH_RESULTS',
  payload: {
    searchResults,
    totalResults,
    options,
    error,
  },
})
