// Copyright 2019 Stanford University see LICENSE for license

// Keeps a unique list of templates limited to 7
export const addTemplateHistory = (state, action) => {
  const newState = { ...state }
  if (newState.historicalTemplates.indexOf(action.payload) !== -1) return newState

  newState.historicalTemplates = [...state.historicalTemplates, action.payload].slice(-7)
  return newState
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
