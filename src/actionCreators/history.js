// Copyright 2019 Stanford University see LICENSE for license
import { addTemplateHistoryByResult, addSearchHistory } from 'actions/history'
import { getTemplateSearchResultsByIds } from 'sinopiaSearch'
import _ from 'lodash'
import { findAuthorityConfig } from 'utilities/authorityConfig'

export const loadTemplateHistory = (templateIds) => (dispatch) => {
  if (_.isEmpty(templateIds)) return
  getTemplateSearchResultsByIds(templateIds)
    .then((response) => {
      if (response.error) {
        console.error(response.error)
        return
      }
      const resultMap = {}
      response.results.forEach((result) => resultMap[result.id] = result)
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

    dispatch(addSearchHistory(search.authorityUri, authorityConfig.label, search.query))
  })
}
