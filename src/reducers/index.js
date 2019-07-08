// Copyright 2018, 2019 Stanford University see LICENSE for license
/* eslint complexity: ["warn", 18] */

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

const selectorReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_ITEMS':
    case 'CHANGE_SELECTIONS':
      return setItemsOrSelections(state, action)
    case 'RETRIEVE_ERROR':
      return setRetrieveError(state, action)
    case 'SET_BASE_URL':
      return setBaseURL(state, action)
    case 'SHOW_RESOURCE_URI_MESSAGE':
      return showResourceURIMessage(state, action)
    case 'SHOW_GROUP_CHOOSER':
      return showGroupChooser(state, action)
    case 'CLOSE_GROUP_CHOOSER':
      return closeGroupChooser(state, action)
    case 'SET_LANG':
      return setMyItemsLang(state, action)
    case 'SHOW_RDF_PREVIEW':
      return showRdfPreview(state, action)
    case 'REMOVE_ITEM':
      return removeMyItem(state, action)
    case 'REMOVE_ALL_CONTENT':
      return removeAllContent(state, action)
    case 'SAVE_APP_VERSION':
      return saveAppVersion(state, action)
    case 'SET_RESOURCE':
      return setResource(state, action)
    case 'SET_RESOURCE_TEMPLATE':
      return setResourceTemplate(state, action)
    case 'UPDATE_PROPERTY':
      return updateProperty(state, action)
    case 'APPEND_RESOURCE':
      return appendResource(state, action)
    case 'TOGGLE_COLLAPSE':
      return toggleCollapse(state, action)
    default:
      return state
  }
}

const appReducer = combineReducers({
  authenticate,
  selectorReducer,
})

export default appReducer
