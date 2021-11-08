// Copyright 2019 Stanford University see LICENSE for license
import { setSearchResults } from "actions/search"
import { getSearchResultsWithFacets } from "sinopiaSearch"
import { createLookupPromise } from "utilities/QuestioningAuthority"
import {
  findAuthorityConfig,
  sinopiaSearchUri,
} from "utilities/authorityConfig"
import { addSearchHistory as addApiSearchHistory } from "actionCreators/user"
import { addSearchHistory } from "actions/history"
import { clearErrors, addError } from "actions/errors"

export const fetchSinopiaSearchResults =
  (query, options, errorKey) => (dispatch) => {
    dispatch(clearErrors(errorKey))
    return getSearchResultsWithFacets(query, options).then(
      ([response, facetResponse]) => {
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
        if (response.error) {
          dispatch(
            addError(errorKey, [
              `An error occurred while searching: ${response.error.toString()}`,
            ])
          )
          return false
        }
        return true
      }
    )
  }

export const fetchQASearchResults =
  (query, uri, errorKey, options = {}) =>
  (dispatch) => {
    const authorityConfig = findAuthorityConfig(uri)
    const searchPromise = createLookupPromise(query, authorityConfig, options)

    dispatch(clearErrors(errorKey))
    return searchPromise.then((response) => {
      if (response.isError) {
        dispatch(
          setSearchResults(
            "resource",
            uri,
            [],
            0,
            {},
            query,
            options,
            response.errorObject.message
          )
        )
        dispatch(
          addError(errorKey, [
            `An error occurred while searching: ${response.errorObject.message}`,
          ])
        )
        return false
      }
      dispatch(addSearchHistory(uri, authorityConfig.label, query))
      dispatch(addApiSearchHistory(uri, query))
      dispatch(
        setSearchResults(
          "resource",
          uri,
          response.results,
          response.response_header.total_records,
          {},
          query,
          options
        )
      )
      return true
    })
  }
