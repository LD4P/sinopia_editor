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
  const newState = { ...state }

  const newSubjectTemplate = { ...action.payload }

  newSubjectTemplate.propertyTemplates.forEach((propertyTemplate) => {
    newState.entities.propertyTemplates[propertyTemplate.key] = { ...propertyTemplate }
  })
  delete newSubjectTemplate.propertyTemplates
  newState.entities.subjectTemplates[newSubjectTemplate.key] = newSubjectTemplate

  return newState
}
