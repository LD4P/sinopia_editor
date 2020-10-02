// Copyright 2019 Stanford University see LICENSE for license

import Config from 'Config'
import _ from 'lodash'

export const addTemplateHistoryByResult = (state, action) => addTemplateResult(state, action.payload)

export const addTemplateHistory = (state, action) => {
  const template = action.payload
  const result = {
    id: template.key,
    resourceLabel: template.label,
    resourceURI: template.class,
    uri: template.uri,
    author: template.author,
    remark: template.remark,
    date: template.date,
  }
  return addTemplateResult(state, result)
}

const addTemplateResult = (state, result) => {
  // Don't add if root template.
  if (result.id === Config.rootResourceTemplateId) return state

  return {
    ...state,
    templates: addToHistory(state.templates, result, (newItem, checkItem) => newItem.id !== checkItem.id),
  }
}

export const addSearchHistory = (state, action) => ({
  ...state,
  searches: addToHistory(state.searches, action.payload, (newItem, checkItem) => !_.isEqual(newItem, checkItem)),
})


const addToHistory = (historyItems, newItem, compareFunc) => {
  const filteredHistoryItems = historyItems.filter((checkItem) => compareFunc(newItem, checkItem))
  return [
    newItem,
    ...filteredHistoryItems,
  ].slice(0, 10)
}
