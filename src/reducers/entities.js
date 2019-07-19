// Copyright 2019 Stanford University see LICENSE for license

/**
 * These are the reducers that effect the 'entities' redux store.
 */

export const setResourceTemplate = (state, action) => {
  const resourceTemplateId = action.payload.id
  const newState = { ...state }

  newState.entities.resourceTemplates[resourceTemplateId] = action.payload

  return newState
}

export const clearResourceTemplates = (state) => {
  const newState = { ...state }

  newState.entities.resourceTemplates = {}

  return newState
}

export const setResourceTemplateSummary = (state, action) => {
  const resourceTemplateId = action.payload.id
  const newState = { ...state }

  newState.entities.resourceTemplateSummaries[resourceTemplateId] = action.payload

  return newState
}
