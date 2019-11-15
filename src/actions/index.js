// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 8] */

export const appendError = (errorKey, error) => ({
  type: 'APPEND_ERROR',
  payload: { errorKey, error },
})

export const appendResource = (reduxPath, resource, resourceTemplates) => ({
  type: 'APPEND_RESOURCE',
  payload: { reduxPath, resource, resourceTemplates },
})

export const assignBaseURL = (resourceKey, resourceURI) => ({
  type: 'SET_BASE_URL',
  payload: { resourceKey, resourceURI },
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

export const clearErrors = errorKey => ({
  type: 'CLEAR_ERRORS',
  payload: errorKey,
})

export const clearResource = resourceKey => ({
  type: 'CLEAR_RESOURCE',
  payload: resourceKey,
})

export const clearResourceTemplates = () => ({
  type: 'CLEAR_RESOURCE_TEMPLATES',
})

export const clearSearchResults = () => ({
  type: 'CLEAR_SEARCH_RESULTS',
})

export const clearTemplateSearchResults = () => ({
  type: 'CLEAR_TEMPLATE_SEARCH_RESULTS',
})

export const copyNewResource = resource => ({
  type: 'COPY_NEW_RESOURCE',
  payload: resource,
})

export const hideValidationErrors = resourceKey => ({
  type: 'HIDE_VALIDATION_ERRORS',
  payload: resourceKey,
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

export const saveAppVersion = version => ({
  type: 'SAVE_APP_VERSION',
  payload: version,
})

export const setCurrentResource = resourceKey => ({
  type: 'SET_CURRENT_RESOURCE',
  payload: resourceKey,
})

export const saveResourceFinished = (resourceKey, checksum) => ({
  type: 'SAVE_RESOURCE_FINISHED',
  payload: { resourceKey, checksum },
})

export const setLastSaveChecksum = (resourceKey, checksum) => ({
  type: 'SET_LAST_SAVE_CHECKSUM',
  payload: { resourceKey, checksum },
})

export const setResource = (resourceKey, resource, resourceTemplates) => ({
  type: 'RESOURCE_LOADED',
  payload: { resourceKey, resource, resourceTemplates },
})

export const setResourceTemplate = resourceTemplate => ({
  type: 'RESOURCE_TEMPLATE_LOADED',
  payload: resourceTemplate,
})

export const setResourceTemplates = resourceTemplates => ({
  type: 'RESOURCE_TEMPLATES_LOADED',
  payload: resourceTemplates,
})

export const addTemplateHistory = resourceTemplate => ({
  type: 'ADD_TEMPLATE_HISTORY',
  payload: resourceTemplate,
})

export const setSearchResults = (uri, searchResults, totalResults, query, startOfRange, sortField, sortOrder, error) => ({
  type: 'SET_SEARCH_RESULTS',
  payload: {
    uri,
    searchResults,
    totalResults,
    query,
    startOfRange,
    sortField,
    sortOrder,
    error,
  },
})

export const setTemplateSearchResults = (searchResults, totalResults, error) => ({
  type: 'SET_TEMPLATE_SEARCH_RESULTS',
  payload: {
    searchResults,
    totalResults,
    error,
  },
})

export const setUnusedRDF = (resourceKey, rdf) => ({
  type: 'SET_UNUSED_RDF',
  payload: { resourceKey, rdf },
})

export const showCopyNewMessage = oldUri => ({
  type: 'SHOW_COPY_NEW_MESSAGE',
  payload: oldUri,
})

export const showGroupChooser = resourceKey => ({
  type: 'SHOW_GROUP_CHOOSER',
  payload: resourceKey,
})

export const showRdfPreview = show => ({
  type: 'SHOW_RDF_PREVIEW',
  payload: show,
})

export const showValidationErrors = resourceKey => ({
  type: 'SHOW_VALIDATION_ERRORS',
  payload: resourceKey,
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

export const validateResource = resourceKey => ({
  type: 'VALIDATE_RESOURCE',
  payload: resourceKey,
})
