// Copyright 2019 Stanford University see LICENSE for license

// export const newResource = resourceTemplateId => ({
//   type: 'NEW_RESOURCE',
//   payload: resourceTemplateId,
// })

export const setResource = resource => ({
  type: 'SET_RESOURCE',
  payload: resource
})

export const setResourceTemplate = resourceTemplate => ({
  type: 'SET_RESOURCE_TEMPLATE',
  payload: resourceTemplate
})

export const stubResource = () => ({
  type: 'STUB_RESOURCE'
})

export const retrieveError = (resourceTemplateId, reason) => ({
  type: 'RETRIEVE_ERROR',
  payload: { resourceTemplateId, reason },
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

export const refreshPropertyTemplate = update => ({
  type: 'REFRESH_PROPERTY_TEMPLATE',
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

export const showResourceURIMessage = resourceUri => ({
  type: 'SHOW_RESOURCE_URI_MESSAGE',
  payload: resourceUri,
})

export const updateStarted = () => ({
  type: 'UPDATE_STARTED',
})

export const updateFinished = () => ({
  type: 'UPDATE_FINISHED',
})

export const retrieveResourceStarted = uri => ({
  type: 'RETRIEVE_STARTED',
  payload: uri,
})

export const retrieveResourceFinished = (uri, data) => ({
  type: 'RETRIEVE_FINISHED',
  payload: {
    uri,
    data,
  },
})

export const retrieveResourceTemplateStarted = resourceTemplateId => ({
  type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED',
  payload: resourceTemplateId,
})

export const retrieveResourceTemplateFinished = (resourceTemplateId, body) => ({
  type: 'RETRIEVE_RESOURCE_TEMPLATE_FINISHED',
  payload: {
    resourceTemplateId,
    body,
  },
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

export const saveAppVersion = version => ({
  type: 'SAVE_APP_VERSION',
  payload: version,
})

export const updateResource = (reduxPath, resourceFragment) => ({
  type: 'UPDATE_RESOURCE',
  payload: { reduxPath, resourceFragment },
})
