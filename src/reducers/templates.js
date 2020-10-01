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
  const filteredResults = state.historicalTemplates.filter((checkResult) => checkResult.id !== result.id)

  // Add it to beginning.
  const newResults = [
    result,
    ...filteredResults,
  ].slice(0, 10)

  return {
    ...state,
    historicalTemplates: newResults,
  }
}


export const addTemplates = (state, action) => {
  const newSubjectTemplate = { ...action.payload }

  const newState = {
    ...state,
    subjectTemplates: { ...state.subjectTemplates },
    propertyTemplates: { ...state.propertyTemplates },
  }

  newSubjectTemplate.propertyTemplates.forEach((propertyTemplate) => {
    newState.propertyTemplates[propertyTemplate.key] = { ...propertyTemplate }
  })
  delete newSubjectTemplate.propertyTemplates
  newState.subjectTemplates[newSubjectTemplate.key] = newSubjectTemplate

  return newState
}
