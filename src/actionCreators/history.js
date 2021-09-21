// Copyright 2019 Stanford University see LICENSE for license
import {
  addTemplateHistoryByResult,
  addSearchHistory,
  addResourceHistoryByResult,
  addResourceHistory as addResourceHistoryAction,
} from "actions/history"
import {
  getTemplateSearchResultsByIds,
  getSearchResultsByUris,
} from "sinopiaSearch"
import _ from "lodash"
import { findAuthorityConfig } from "utilities/authorityConfig"

export const loadTemplateHistory = (templateIds) => (dispatch) => {
  if (_.isEmpty(templateIds)) return
  getTemplateSearchResultsByIds(templateIds)
    .then((response) => {
      if (response.error) {
        console.error(response.error)
        return
      }
      const resultMap = {}
      response.results.forEach((result) => (resultMap[result.id] = result))
      // Reversing so that most recent is at top of list.
      const reversedTemplateIds = [...templateIds].reverse()
      reversedTemplateIds.forEach((templateId) => {
        const result = resultMap[templateId]
        if (!result) return
        dispatch(addTemplateHistoryByResult(result))
      })
    })
    .catch((err) => console.error(err))
}

export const loadSearchHistory = (searches) => (dispatch) => {
  if (_.isEmpty(searches)) return
  searches.reverse().forEach((search) => {
    const authorityConfig = findAuthorityConfig(search.authorityUri)
    if (!authorityConfig) return

    dispatch(
      addSearchHistory(search.authorityUri, authorityConfig.label, search.query)
    )
  })
}

export const loadResourceHistory = (resourceUris) => (dispatch) => {
  if (_.isEmpty(resourceUris)) return
  getSearchResultsByUris(resourceUris)
    .then((response) => {
      if (response.error) {
        console.error(response.error)
        return
      }
      const resultMap = {}
      response.results.forEach((result) => (resultMap[result.uri] = result))
      // Reversing so that most recent is at top of list.
      const reversedResourceUris = [...resourceUris].reverse()
      reversedResourceUris.forEach((resourceUri) => {
        const result = resultMap[resourceUri]
        if (!result) return
        dispatch(addResourceHistoryByResult(result))
      })
    })
    .catch((err) => console.error(err))
}

export const addResourceHistory =
  (resourceUri, type, group, modified) => (dispatch) => {
    // Try to find it by search. If not available, just use the resource.
    getSearchResultsByUris([resourceUri])
      .then((response) => {
        if (response.error) {
          console.error(response.error)
          return
        }
        if (response.results.length !== 1) {
          dispatch(
            addResourceHistoryAction(
              resourceUri,
              type,
              group,
              modified || new Date().toISOString()
            )
          )
        } else {
          dispatch(addResourceHistoryByResult(response.results[0]))
        }
      })
      .catch((err) => console.error(err))
  }
