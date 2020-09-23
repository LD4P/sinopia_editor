// Copyright 2019 Stanford University see LICENSE for license

import Config from 'Config'

// Keeps a unique list of templates limited to 7
export const addTemplateHistory = (state, action) => {
  const templateId = action.payload
  if (state.historicalTemplates.indexOf(templateId) !== -1
      || templateId === Config.rootResourceTemplateId) return state

  return {
    ...state,
    historicalTemplates: [...state.historicalTemplates, templateId].slice(-7),
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
