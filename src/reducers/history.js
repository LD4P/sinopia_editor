// Copyright 2019 Stanford University see LICENSE for license

import Config from 'Config'

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

  // Remove if already exists.
  const filteredResults = state.templates.filter((checkResult) => checkResult.id !== result.id)

  // Add it to beginning.
  const newResults = [
    result,
    ...filteredResults,
  ].slice(0, 10)

  return {
    ...state,
    templates: newResults,
  }
}
