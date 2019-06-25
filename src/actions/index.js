// Copyright 2019 Stanford University see LICENSE for license

export const retrieveError = resourceTemplateId => ({
  type: 'RETRIEVE_ERROR',
  payload: resourceTemplateId,
})

export const setItems = item => ({
  type: 'SET_ITEMS',
  payload: item,
})

export const showGroupChooser = show => ({
  type: 'SHOW_GROUP_CHOOSER',
  payload: show,
})

export const closeGroupChooser = () => ({
  type: 'CLOSE_GROUP_CHOOSER',
})

export const refreshResourceTemplate = update => ({
  type: 'REFRESH_RESOURCE_TEMPLATE',
  payload: update,
})

export const rootResourceTemplateLoaded = resourceTemplate => ({
  type: 'ROOT_RESOURCE_TEMPLATE_LOADED',
  payload: resourceTemplate,
})

export const removeItem = (reduxPath, id) => ({
  type: 'REMOVE_ITEM',
  payload: { reduxPath, id },
})

export const removeAllContent = item => ({
  type: 'REMOVE_ALL_CONTENT',
  payload: item,
})

export const removeAllItems = item => ({
  type: 'REMOVE_ALL',
  payload: item,
})

export const assignBaseURL = item => ({
  type: 'SET_BASE_URL',
  payload: item,
})

export const updateStarted = () => ({
  type: 'UPDATE_STARTED',
})

export const updateFinished = () => ({
  type: 'UPDATE_FINISHED',
})

export const retrieveResourceTemplateStarted = resourceTemplateId => ({
  type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED',
  payload: resourceTemplateId,
})

export const changeSelections = item => ({
  type: 'CHANGE_SELECTIONS',
  payload: item,
})

export const setLang = item => ({
  type: 'SET_LANG',
  payload: item,
})

export const showRdfPreview = show => ({
  type: 'SHOW_RDF_PREVIEW',
  payload: show,
})

export const resourceTemplateLoaded = resourceTemplate => ({
  type: 'RESOURCE_TEMPLATE_LOADED',
  payload: resourceTemplate,
})

export const authenticationFailure = authenticationResult => ({
  type: 'AUTHENTICATION_FAILURE',
  payload: authenticationResult,
})

export const authenticationSuccess = authenticationResult => ({
  type: 'AUTHENTICATION_SUCCESS',
  payload: authenticationResult,
})

export const signOutSuccess = () => ({
  type: 'SIGN_OUT_SUCCESS',
})
