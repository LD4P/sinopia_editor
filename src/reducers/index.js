// Copyright 2018, 2019 Stanford University see LICENSE for license

import { combineReducers } from 'redux'
import authenticate from './authenticate'
import {
  removeAllContent, removeMyItem, setItemsOrSelections, setBaseURL, showResourceURIMessage, setMyItemsLang,
  showGroupChooser, closeGroupChooser, showRdfPreview,
} from './inputs'
import { findNode } from 'selectors/resourceSelectors'
import _ from 'lodash'

export const setResource = (state, action) => {
  // This should be a lodash cloneDeep.
  const newState = { ...state, resource: action.payload }
  return newState
}

export const setResourceTemplate = (state, action) => {
  const resourceTemplateId = action.payload.id
  const newState = { ...state }

  newState.entities.resourceTemplates[resourceTemplateId] = action.payload

  return newState
}

export const updateProperty = (state, action) => {
  const reduxPath = action.payload.reduxPath
  const resourceFragment = _.cloneDeep(action.payload.resourceFragment)
  // This is not the optimal deep copy
  const newState = _.cloneDeep(state)

  const propertyURI = reduxPath.slice(-1)[0]
  const tempReduxPath = reduxPath.slice(0, reduxPath.length - 1)
  const tempNode = findNode(newState, tempReduxPath)
  tempNode[propertyURI] = resourceFragment

  return newState
}

export const appendResource = (state, action) => {
  const reduxPath = action.payload.reduxPath
  const resource = _.cloneDeep(action.payload.resource)
  // This is not the optimal deep copy
  const newState = _.cloneDeep(state)

  const key = reduxPath.slice(-2)[0]
  const parentReduxPath = reduxPath.slice(0, reduxPath.length - 2)
  const parentPropertyNode = findNode(newState, parentReduxPath)
  parentPropertyNode[key] = resource[key]
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

const handlers = {
  SET_ITEMS: setItemsOrSelections,
  CHANGE_SELECTIONS: setItemsOrSelections,
  RETRIEVE_ERROR: setRetrieveError,
  SET_BASE_URL: setBaseURL,
  SHOW_RESOURCE_URI_MESSAGE: showResourceURIMessage,
  SHOW_GROUP_CHOOSER: showGroupChooser,
  CLOSE_GROUP_CHOOSER: closeGroupChooser,
  SET_LANG: setMyItemsLang,
  SHOW_RDF_PREVIEW: showRdfPreview,
  REMOVE_ITEM: removeMyItem,
  REMOVE_ALL_CONTENT: removeAllContent,
  SAVE_APP_VERSION: saveAppVersion,
  SET_RESOURCE: setResource,
  SET_RESOURCE_TEMPLATE: setResourceTemplate,
  UPDATE_PROPERTY: updateProperty,
  APPEND_RESOURCE: appendResource,
  TOGGLE_COLLAPSE: toggleCollapse,
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
