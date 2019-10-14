// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 6] */

export const appendResource = (reduxPath, resource, resourceTemplates) => ({
  type: 'APPEND_RESOURCE',
  payload: { reduxPath, resource, resourceTemplates },
})

export const assignBaseURL = item => ({
  type: 'SET_BASE_URL',
  payload: item,
})

export const authenticationFailure = authenticationResult => ({
  type: 'AUTHENTICATION_FAILURE',
  payload: authenticationResult,
})

export const authenticationSuccess = authenticationResult => ({
  type: 'AUTHENTICATION_SUCCESS',
  payload: authenticationResult,
})

export const changeSelections = item => ({
  type: 'CHANGE_SELECTIONS',
  payload: item,
})

export const clearRetrieveResourceError = () => ({
  type: 'CLEAR_RETRIEVE_RESOURCE_ERROR',
})

export const clearRetrieveResourceTemplateError = () => ({
  type: 'CLEAR_RETRIEVE_RESOURCE_TEMPLATE_ERROR',
})

export const clearSaveResourceError = () => ({
  type: 'CLEAR_SAVE_RESOURCE_ERROR',
})

export const clearSaveResourceTemplateError = () => ({
  type: 'CLEAR_SAVE_RESOURCE_TEMPLATE_ERROR',
})

export const clearSearchResults = () => ({
  type: 'CLEAR_SEARCH_RESULTS',
})

export const closeGroupChooser = () => ({
  type: 'CLOSE_GROUP_CHOOSER',
})

export const closeResourceTemplateChooser = () => ({
  type: 'CLOSE_RESOURCE_TEMPLATE_CHOOSER',
})

export const copyNewResource = copyInfo => ({
  type: 'COPY_NEW_RESOURCE',
  payload: copyInfo,
})

export const itemsSelected = item => ({
  type: 'ITEMS_SELECTED',
  payload: item,
})

export const languageSelected = item => ({
  type: 'LANGUAGE_SELECTED',
  payload: item,
})

export const languageSelectOpened = () => ({
  type: 'LANGUAGE_SELECT_OPENED',
})

export const loadingQaResults = () => ({
  type: 'LOADING_QA_RESULTS',
})

export const qaResultsReceived = results => ({
  type: 'QA_RESULTS_RECEIVED',
  payload: results,
})

export const removeAllItems = item => ({
  type: 'REMOVE_ALL',
  payload: item,
})

export const removeItem = reduxPath => ({
  type: 'REMOVE_ITEM',
  payload: reduxPath,
})

export const removeResource = reduxPath => ({
  type: 'REMOVE_RESOURCE',
  payload: reduxPath,
})

export const retrieveResourceStarted = uri => ({
  type: 'RETRIEVE_RESOURCE_STARTED',
  payload: uri,
})

export const retrieveResourceTemplateStarted = resourceTemplateId => ({
  type: 'RETRIEVE_RESOURCE_TEMPLATE_STARTED',
  payload: resourceTemplateId,
})

export const saveAppVersion = version => ({
  type: 'SAVE_APP_VERSION',
  payload: version,
})

export const saveResourceFinished = checksum => ({
  type: 'SAVE_RESOURCE_FINISHED',
  payload: checksum,
})

export const saveResourceStarted = () => ({
  type: 'SAVE_RESOURCE_STARTED',
})

export const saveResourceTemplateStarted = () => ({
  type: 'SAVE_RESOURCE_TEMPLATE_STARTED',
})

export const setLastSaveChecksum = checksum => ({
  type: 'SET_LAST_SAVE_CHECKSUM',
  payload: checksum,
})

export const setRetrieveResourceError = (uri, reason) => ({
  type: 'RETRIEVE_RESOURCE_ERROR',
  payload: { uri, reason },
})

export const setRetrieveResourceTemplateError = (resourceTemplateId, reason) => ({
  type: 'RETRIEVE_RESOURCE_TEMPLATE_ERROR',
  payload: { resourceTemplateId, reason },
})

export const setResource = (resource, resourceTemplates) => ({
  type: 'RESOURCE_LOADED',
  payload: { resource, resourceTemplates },
})

export const setResourceTemplate = resourceTemplate => ({
  type: 'RESOURCE_TEMPLATE_LOADED',
  payload: resourceTemplate,
})

export const setResourceTemplateSummary = resourceTemplateSummary => ({
  type: 'RESOURCE_TEMPLATE_SUMMARY_LOADED',
  payload: resourceTemplateSummary,
})

export const setSaveResourceError = (uri, reason) => ({
  type: 'SAVE_RESOURCE_ERROR',
  payload: { uri, reason },
})

export const setSaveResourceTemplateError = (resourceTemplateId, reason) => ({
  type: 'SAVE_RESOURCE_TEMPLATE_ERROR',
  payload: { resourceTemplateId, reason },
})

export const setSearchResults = (uri, searchResults, totalResults, query, startOfRange, error) => ({
  type: 'SET_SEARCH_RESULTS',
  payload: {
    uri,
    searchResults,
    totalResults,
    query,
    startOfRange,
    error,
  },
})

export const setUnusedRDF = rdf => ({
  type: 'SET_UNUSED_RDF',
  payload: rdf,
})

export const showCopyNewMessage = showInfo => ({
  type: 'SHOW_COPY_NEW_MESSAGE',
  payload: showInfo,
})

export const showGroupChooser = show => ({
  type: 'SHOW_GROUP_CHOOSER',
  payload: show,
})

export const showRdfPreview = show => ({
  type: 'SHOW_RDF_PREVIEW',
  payload: show,
})

export const showResourceTemplateChooser = () => ({
  type: 'SHOW_RESOURCE_TEMPLATE_CHOOSER',
})

export const signOutSuccess = () => ({
  type: 'SIGN_OUT_SUCCESS',
})

export const stubResource = () => ({
  type: 'STUB_RESOURCE',
})

export const toggleCollapse = reduxPath => ({
  type: 'TOGGLE_COLLAPSE',
  payload: { reduxPath },
})

export const updateProperty = (reduxPath, resourceFragment, resourceTemplates) => ({
  type: 'UPDATE_PROPERTY',
  payload: { reduxPath, resourceFragment, resourceTemplates },
})
