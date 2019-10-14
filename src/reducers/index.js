// Copyright 2018, 2019 Stanford University see LICENSE for license

import { combineReducers } from 'redux'
import authenticate from './authenticate'
import {
  removeMyItem, setItemsOrSelections, setBaseURL,
  setMyItemsLang, showGroupChooser, closeGroupChooser, showRdfPreview,
  showCopyNewMessage, validate, showResourceTemplateChooser, closeResourceTemplateChooser,
} from './inputs'
import {
  setResourceTemplate, setResourceTemplateSummary,
  loadingLanguages, languagesReceived,
  loadingQaResults, qaResultsReceived, copyResourceToEditor,
} from './entities'
import { clearSearchResults, setSearchResults } from './search'
import { findObjectAtPath } from 'selectors/resourceSelectors'
import lookupOptionsRetrieved from './lookups'
import _ from 'lodash'

export const setResource = (state, action) => {
  // This should be a lodash cloneDeep.
  const newState = { ...state }
  newState.editor.displayValidations = false
  newState.editor.errors = []
  newState.editor.copyToNewMessage = {}
  newState.resource = action.payload.resource
  newState.entities.resourceTemplates = { ...newState.entities.resourceTemplates, ...action.payload.resourceTemplates}
  return newState
}

export const updateProperty = (state, action) => {
  const reduxPath = action.payload.reduxPath
  const resourceFragment = _.cloneDeep(action.payload.resourceFragment)
  // This is not the optimal deep copy
  const newState = _.cloneDeep(state)

  const propertyURI = reduxPath.slice(-1)[0]
  const tempReduxPath = reduxPath.slice(0, reduxPath.length - 1)
  const tempNode = findObjectAtPath(newState, tempReduxPath)
  tempNode[propertyURI] = resourceFragment

  newState.entities.resourceTemplates = { ...newState.entities.resourceTemplates, ...action.payload.resourceTemplates}

  return validate(newState)
}

export const appendResource = (state, action) => {
  const reduxPath = action.payload.reduxPath
  const resource = _.cloneDeep(action.payload.resource)
  // This is not the optimal deep copy
  const newState = _.cloneDeep(state)

  const key = reduxPath.slice(-2)[0]
  const parentReduxPath = reduxPath.slice(0, reduxPath.length - 2)
  const parentPropertyNode = findObjectAtPath(newState, parentReduxPath)
  parentPropertyNode[key] = resource[key]

  newState.entities.resourceTemplates = { ...newState.entities.resourceTemplates, ...action.payload.resourceTemplates}

  return validate(newState)
}

export const removeResource = (state, action) => {
  const newState = _.cloneDeep(state)
  const reduxPath = action.payload
  const key = reduxPath.slice(-1)[0]
  const parentReduxPath = reduxPath.slice(0, reduxPath.length - 1)
  const parentPropertyNode = findObjectAtPath(newState, parentReduxPath)
  delete parentPropertyNode[key]
  return validate(newState)
}

export const setSaveResourceError = (state, action) => {
  const uri = action.payload.uri
  const reason = action.payload.reason
  const newState = { ...state }

  let error = 'There was a problem saving'
  if (uri) {
    error += ` ${uri}`
  }
  if (reason) {
    error += `: ${reason}`
  } else {
    error += '.'
  }

  newState.editor.saveResourceError = error
  return newState
}

export const setSaveResourceTemplateError = (state, action) => {
  const resourceTemplateId = action.payload.resourceTemplateId
  const reason = action.payload.reason
  const newState = { ...state }

  let error = `There was a problem saving ${resourceTemplateId}`
  if (reason) {
    error += `: ${reason}`
  } else {
    error += '.'
  }

  newState.editor.saveResourceTemplateError = error
  return newState
}

export const setRetrieveResourceTemplateError = (state, action) => {
  const resourceTemplateId = action.payload.resourceTemplateId
  const reason = action.payload.reason
  const newState = { ...state }

  let error = `There was a problem retrieving ${resourceTemplateId}`
  if (reason) {
    error += `: ${reason}`
  } else {
    error += '.'
  }

  newState.editor.retrieveResourceTemplateError = error
  return newState
}

export const setRetrieveResourceError = (state, action) => {
  const uri = action.payload.uri
  const reason = action.payload.reason
  const newState = { ...state }

  let error = `There was a problem retrieving ${uri}`
  if (reason) {
    error += `: ${reason}`
  } else {
    error += '.'
  }

  newState.editor.retrieveResourceError = error
  return newState
}


export const clearRetrieveResourceTemplateError = (state) => {
  const newEditor = { ...state.editor, retrieveResourceTemplateError: undefined }
  return { ...state, editor: newEditor }
}

export const clearRetrieveResourceError = (state) => {
  const newEditor = { ...state.editor, retrieveResourceError: undefined }
  return { ...state, editor: newEditor }
}

export const clearSaveResourceTemplateError = (state) => {
  const newEditor = { ...state.editor, saveResourceTemplateError: undefined }
  return { ...state, editor: newEditor }
}

export const clearSaveResourceError = (state) => {
  const newEditor = { ...state.editor, saveResourceError: undefined }
  return { ...state, editor: newEditor }
}

export const saveAppVersion = (state, action) => {
  const newState = { ...state }

  newState.appVersion.version = action.payload
  return newState
}

/**
 * Set a section to expanded or collapsed.
 * This sets values in the redux store under editor.expanded and then the reduxPath
 */
export const toggleCollapse = (state, action) => {
  const newState = { ...state }
  const expanded = newState.editor.expanded
  const reduxPath = action.payload.reduxPath
  const items = reduxPath.reduce((obj, key) => obj[key] || (obj[key] = {}), expanded)

  if (typeof items.expanded === 'undefined') {
    items.expanded = true
  } else {
    items.expanded = !items.expanded
  }

  return newState
}

export const saveResourceFinished = (state, action) => {
  const newState = { ...state }
  newState.editor.lastSave = Date.now()
  newState.editor.lastSaveChecksum = action.payload

  return newState
}

export const setLastSaveChecksum = (state, action) => {
  const newState = { ...state }
  newState.editor.lastSaveChecksum = action.payload

  return newState
}

export const setUnusedRDF = (state, action) => {
  const newState = { ...state }
  newState.editor.unusedRDF = action.payload

  return newState
}

const handlers = {
  APPEND_RESOURCE: appendResource,
  CHANGE_SELECTIONS: setItemsOrSelections,
  CLEAR_RETRIEVE_RESOURCE_ERROR: clearRetrieveResourceError,
  CLEAR_RETRIEVE_RESOURCE_TEMPLATE_ERROR: clearRetrieveResourceTemplateError,
  CLEAR_SAVE_RESOURCE_ERROR: clearSaveResourceError,
  CLEAR_SAVE_RESOURCE_TEMPLATE_ERROR: clearSaveResourceTemplateError,
  CLEAR_SEARCH_RESULTS: clearSearchResults,
  CLOSE_GROUP_CHOOSER: closeGroupChooser,
  CLOSE_RESOURCE_TEMPLATE_CHOOSER: closeResourceTemplateChooser,
  COPY_NEW_RESOURCE: copyResourceToEditor,
  ITEMS_SELECTED: setItemsOrSelections,
  LANGUAGE_SELECTED: setMyItemsLang,
  LANGUAGES_RECEIVED: languagesReceived,
  LOADING_LANGUAGES: loadingLanguages,
  LOADING_QA_RESULTS: loadingQaResults,
  LOOKUP_OPTIONS_RETRIEVED: lookupOptionsRetrieved,
  PUBLISH_STARTED: clearSaveResourceError,
  QA_RESULTS_RECEIVED: qaResultsReceived,
  REMOVE_ITEM: removeMyItem,
  REMOVE_RESOURCE: removeResource,
  RESOURCE_LOADED: setResource,
  RESOURCE_TEMPLATE_LOADED: setResourceTemplate,
  RESOURCE_TEMPLATE_SUMMARY_LOADED: setResourceTemplateSummary,
  RETRIEVE_RESOURCE_ERROR: setRetrieveResourceError,
  RETRIEVE_RESOURCE_STARTED: clearRetrieveResourceError,
  RETRIEVE_RESOURCE_TEMPLATE_ERROR: setRetrieveResourceTemplateError,
  RETRIEVE_RESOURCE_TEMPLATE_STARTED: clearRetrieveResourceTemplateError,
  SAVE_APP_VERSION: saveAppVersion,
  SAVE_RESOURCE_ERROR: setSaveResourceError,
  SAVE_RESOURCE_FINISHED: saveResourceFinished,
  SAVE_RESOURCE_STARTED: clearSaveResourceError,
  SAVE_RESOURCE_TEMPLATE_ERROR: setSaveResourceTemplateError,
  SAVE_RESOURCE_TEMPLATE_STARTED: clearSaveResourceTemplateError,
  SET_BASE_URL: setBaseURL,
  SET_LAST_SAVE_CHECKSUM: setLastSaveChecksum,
  SET_SEARCH_RESULTS: setSearchResults,
  SET_UNUSED_RDF: setUnusedRDF,
  SHOW_COPY_NEW_MESSAGE: showCopyNewMessage,
  SHOW_GROUP_CHOOSER: showGroupChooser,
  SHOW_RESOURCE_TEMPLATE_CHOOSER: showResourceTemplateChooser,
  SHOW_RDF_PREVIEW: showRdfPreview,
  TOGGLE_COLLAPSE: toggleCollapse,
  UPDATE_PROPERTY: updateProperty,
}

export const createReducer = handlers => (state = {}, action) => {
  const fn = handlers[action.type]
  return fn ? fn(state, action) : state
}

const appReducer = combineReducers({
  authenticate,
  selectorReducer: createReducer(handlers),
})

export default appReducer
