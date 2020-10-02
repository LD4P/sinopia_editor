// Copyright 2019 Stanford University see LICENSE for license

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

export const noop = () => {}
