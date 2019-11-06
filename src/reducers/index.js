// Copyright 2018, 2019 Stanford University see LICENSE for license

import { combineReducers } from 'redux'
import authenticate from './authenticate'
import {
  removeMyItem, setItemsOrSelections, setBaseURL, setMyItemsLang,
  showCopyNewMessage, validate, hideValidationErrors,
} from './inputs'
import {
  showGroupChooser, showValidationErrors,
  showModal, hideModal, addModalMessage, clearModalMessages,
} from './modals'
import {
  setTemplateMessages, clearTemplateMessages,
} from './flash'
import {
  setResourceTemplate, clearResourceTemplates,
  loadingLanguages, languagesReceived, exportsReceived,
  loadingQaResults, qaResultsReceived, copyResourceToEditor,
} from './entities'
import {
  clearSearchResults, setSearchResults, clearTemplateSearchResults, setTemplateSearchResults,
} from './search'
import { findObjectAtPath } from 'selectors/resourceSelectors'
import lookupOptionsRetrieved from './lookups'
import _ from 'lodash'

export const setResource = (state, action) => {
  // This should be a lodash cloneDeep.
  const newState = { ...state }
  newState.editor.resourceValidation.show = false
  newState.editor.copyToNewMessage = {}
  newState.resource = action.payload.resource
  newState.entities.resourceTemplates = { ...newState.entities.resourceTemplates, ...action.payload.resourceTemplates }
  return validate(newState)
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

  newState.entities.resourceTemplates = { ...newState.entities.resourceTemplates, ...action.payload.resourceTemplates }

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

  newState.entities.resourceTemplates = { ...newState.entities.resourceTemplates, ...action.payload.resourceTemplates }

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

export const appendError = (state, action) => {
  const newState = { ...state }

  const existingErrors = newState.editor.errors[action.payload.errorKey]
  if (existingErrors) {
    newState.editor.errors[action.payload.errorKey] = [...existingErrors, action.payload.error]
  } else {
    newState.editor.errors[action.payload.errorKey] = [action.payload.error]
  }

  return newState
}

export const clearErrors = (state, action) => {
  const newState = { ...state }

  newState.editor.errors[action.payload] = []

  return newState
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
  ADD_MODAL_MESSAGE: addModalMessage,
  APPEND_ERROR: appendError,
  APPEND_RESOURCE: appendResource,
  CHANGE_SELECTIONS: setItemsOrSelections,
  CLEAR_ERRORS: clearErrors,
  CLEAR_MODAL_MESSAGES: clearModalMessages,
  CLEAR_TEMPLATE_MESSAGES: clearTemplateMessages,
  CLEAR_RESOURCE_TEMPLATES: clearResourceTemplates,
  CLEAR_SEARCH_RESULTS: clearSearchResults,
  CLEAR_TEMPLATE_SEARCH_RESULTS: clearTemplateSearchResults,
  COPY_NEW_RESOURCE: copyResourceToEditor,
  EXPORTS_RECEIVED: exportsReceived,
  HIDE_MODAL: hideModal,
  HIDE_VALIDATION_ERRORS: hideValidationErrors,
  ITEMS_SELECTED: setItemsOrSelections,
  LANGUAGE_SELECTED: setMyItemsLang,
  LANGUAGES_RECEIVED: languagesReceived,
  LOADING_LANGUAGES: loadingLanguages,
  LOADING_QA_RESULTS: loadingQaResults,
  LOOKUP_OPTIONS_RETRIEVED: lookupOptionsRetrieved,
  QA_RESULTS_RECEIVED: qaResultsReceived,
  REMOVE_ITEM: removeMyItem,
  REMOVE_RESOURCE: removeResource,
  RESOURCE_LOADED: setResource,
  RESOURCE_TEMPLATE_LOADED: setResourceTemplate,
  SAVE_APP_VERSION: saveAppVersion,
  SAVE_RESOURCE_FINISHED: saveResourceFinished,
  SET_BASE_URL: setBaseURL,
  SET_TEMPLATE_MESSAGES: setTemplateMessages,
  SET_LAST_SAVE_CHECKSUM: setLastSaveChecksum,
  SET_SEARCH_RESULTS: setSearchResults,
  SET_TEMPLATE_SEARCH_RESULTS: setTemplateSearchResults,
  SET_UNUSED_RDF: setUnusedRDF,
  SHOW_COPY_NEW_MESSAGE: showCopyNewMessage,
  SHOW_GROUP_CHOOSER: showGroupChooser,
  SHOW_MODAL: showModal,
  SHOW_VALIDATION_ERRORS: showValidationErrors,
  TOGGLE_COLLAPSE: toggleCollapse,
  UPDATE_PROPERTY: updateProperty,
  VALIDATE_RESOURCE: validate,
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
