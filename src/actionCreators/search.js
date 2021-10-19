// Copyright 2019 Stanford University see LICENSE for license
import { setSearchResults } from "actions/search"
import { getSearchResultsWithFacets } from "sinopiaSearch"
import { createLookupPromise } from "utilities/QuestioningAuthority"
import { findAuthorityConfig, sinopiaSearchUri } from "utilities/authorityConfig"
import { addSearchHistory as addApiSearchHistory } from "actionCreators/user"
import { addSearchHistory } from "actions/history"

export const fetchSinopiaSearchResults = (query, options) => (dispatch) =>
  getSearchResultsWithFacets(query, options).then(([response, facetResponse]) => {
    dispatch(addSearchHistory(sinopiaSearchUri, "Sinopia resources", query))
    dispatch(addApiSearchHistory(sinopiaSearchUri, query))
    dispatch(
      setSearchResults(
        "resource",
        sinopiaSearchUri,
        response.results,
        response.totalHits,
        facetResponse || {},
        query,
        options,
        response.error
      )
    )
  })

export const fetchQASearchResults =
  (query, uri, options = {}) =>
  (dispatch) => {
    const authorityConfig = findAuthorityConfig(uri)
    const searchPromise = createLookupPromise(query, authorityConfig, options)

    return searchPromise.then((response) => {
      if (response.isError) {
        dispatch(
          setSearchResults("resource", uri, [], 0, {}, query, options, response.errorObject.message)
        )
      } else {
        dispatch(addSearchHistory(uri, authorityConfig.label, query))
        dispatch(addApiSearchHistory(uri, query))
        dispatch(
          setSearchResults(
            "resource",
            uri,
            response.body.results,
            response.body.response_header.total_records,
            {},
            query,
            options
          )
        )
      }
    })
  }
