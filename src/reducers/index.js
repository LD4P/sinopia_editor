// Copyright 2018, 2019 Stanford University see LICENSE for license

import { combineReducers } from 'redux'
import authenticate from './authenticate'
import {
  removeMyItem, setItemsOrSelections, setBaseURL,
  setMyItemsLang, showGroupChooser, closeGroupChooser, showRdfPreview, validate,
} from './inputs'
import {
  setResourceTemplate, clearResourceTemplates, setResourceTemplateSummary,
  loadingLanguages, languagesReceived,
  loadingQaResults, qaResultsReceived,
} from './entities'
import setSearchResults from './search'
import { findObjectAtPath } from 'selectors/resourceSelectors'
import _ from 'lodash'

export const setResource = (state, action) => {
  // This should be a lodash cloneDeep.
  const newState = { ...state }
  newState.resource = action.payload.resource
  newState.entities.resourceTemplates = _.cloneDeep(action.payload.resourceTemplates)
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

  newState.entities.resourceTemplates = _.cloneDeep(action.payload.resourceTemplates)

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

  newState.entities.resourceTemplates = _.cloneDeep(action.payload.resourceTemplates)

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

export const setPublishError = (state, action) => {
  const newState = { ...state }
  newState.editor.serverError = `There was a problem saving the resource: ${action.payload}`
  return newState
}

export const setRetrieveError = (state, action) => {
  const resourceTemplateId = action.payload.resourceTemplateId
  const reason = action.payload.reason
  const newState = { ...state }

  let serverError = `There was a problem retrieving ${resourceTemplateId}`
  if (reason) {
    serverError += `: ${reason}`
  } else {
    serverError += '.'
  }

  newState.editor.serverError = serverError
  return newState
}

export const clearServerError = (state) => {
  const newEditor = { ...state.editor, serverError: undefined }
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

export const updateFinished = (state, action) => {
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

const handlers = {
  ITEMS_SELECTED: setItemsOrSelections,
  CHANGE_SELECTIONS: setItemsOrSelections,
  PUBLISH_ERROR: setPublishError,
  PUBLISH_STARTED: clearServerError,
  LOADING_QA_RESULTS: loadingQaResults,
  QA_RESULTS_RECEIVED: qaResultsReceived,
  RETRIEVE_ERROR: setRetrieveError,
  RETRIEVE_RESOURCE_TEMPLATE_STARTED: clearServerError,
  SET_BASE_URL: setBaseURL,
  SET_SEARCH_RESULTS: setSearchResults,
  SHOW_GROUP_CHOOSER: showGroupChooser,
  CLOSE_GROUP_CHOOSER: closeGroupChooser,
  LANGUAGE_SELECTED: setMyItemsLang,
  SHOW_RDF_PREVIEW: showRdfPreview,
  REMOVE_ITEM: removeMyItem,
  REMOVE_RESOURCE: removeResource,
  SAVE_APP_VERSION: saveAppVersion,
  SET_RESOURCE: setResource,
  SET_RESOURCE_TEMPLATE: setResourceTemplate,
  UPDATE_PROPERTY: updateProperty,
  APPEND_RESOURCE: appendResource,
  TOGGLE_COLLAPSE: toggleCollapse,
  CLEAR_RESOURCE_TEMPLATES: clearResourceTemplates,
  SET_RESOURCE_TEMPLATE_SUMMARY: setResourceTemplateSummary,
  LANGUAGES_RECEIVED: languagesReceived,
  LOADING_LANGUAGES: loadingLanguages,
  UPDATE_FINISHED: updateFinished,
  SET_LAST_SAVE_CHECKSUM: setLastSaveChecksum,
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
