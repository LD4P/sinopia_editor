// Copyright 2018, 2019 Stanford University see LICENSE for license
/* eslint complexity: ["warn", 15] */

import { combineReducers } from 'redux'
import shortid from 'shortid'
import authenticate from './authenticate'
import {
  removeAllContent, removeMyItem, setItemsOrSelections, setBaseURL, setMyItemsLang,
  showGroupChooser, closeGroupChooser, showRdfPreview,
} from './inputs'
import { findNode } from 'selectors/resourceSelectors'
import { defaultLangTemplate } from 'Utilities'

/**
 * This transforms the property template default values and and template references
 * fetched from the server into redux state
 */
export const populatePropertyDefaults = (propertyTemplate) => {
  const valueConstraints = propertyTemplate.valueConstraint

  if (!valueConstraints) {
    return {}
  }

  const templateDefaults = valueConstraints.defaults || []
  const defaultItems = templateDefaults.map(row => ({
    id: shortid.generate(),
    content: row.defaultLiteral,
    uri: row.defaultURI,
    lang: defaultLangTemplate(),
  }))
  if (defaultItems.length > 0) {
    return { items: defaultItems }
  }

  const templateRefs = valueConstraints.valueTemplateRefs || []
  const propertyDefaults = {}

  templateRefs.forEach((ref) => {
    propertyDefaults[shortid.generate()] = { [ref]: {} }
  })

  return propertyDefaults
}

/**
 * The purpose of this function is to fill out the resource state tree with initial and additional properties,
 * also calling the function to fill in the default values for those properties. This is called when a new top-level
 * resource template is initialized and also when a property template with a nested resource is initialized
 * (by expanding the property in a panel).
 *
 * Whenever a new resource template is initialized, the reduce method (bound to the lastObject variable) will by default
 * append it to the `newState` accumulator, so before everything we must pop out the latest resource id and set that
 * as the only resource in the state tree.
 *
 * @returns {Object} the new state of the redux store.
 */
export const refreshResourceTemplate = (state, action) => {
  const resourceTemplateId = Object.keys(state.resource).pop()
  const newResource = resourceTemplateId ? { [resourceTemplateId]: state.resource[resourceTemplateId] } : {}

  const newState = { ...state, resource: newResource }
  const reduxPath = action.payload.reduxPath
  const propertyTemplate = action.payload.property

  if (reduxPath === undefined || reduxPath.length < 1) {
    return newState
  }
  const defaults = populatePropertyDefaults(propertyTemplate)
  const propertyKey = reduxPath.pop()
  const lastObject = reduxPath.reduce((newState, key) => newState[key] = newState[key] || {}, newState)
  lastObject[propertyKey] = defaults

  return newState
}

/**
 * Called when a top level resource template is loaded
 * the body of the resource template is in `action.payload'
 */
export const rootResourceTemplateLoaded = (state, action) => {
  let newState = resourceTemplateLoaded(state, action)

  const resourceTemplateId = action.payload.id

  action.payload.propertyTemplates.forEach((property) => {
    const propertyAction = {
      payload: {
        reduxPath: ['resource', resourceTemplateId, property.propertyURI],
        property,
      },
    }
    newState = refreshResourceTemplate(newState, propertyAction)
  })

  // Clear any existing validation errors when we load a resource template
  newState.editor.errors = []
  newState.editor.displayValidations = false

  return newState
}

export const resourceTemplateLoaded = (state, action) => {
  const resourceTemplateId = action.payload.id
  const newState = { ...state }

  newState.entities.resourceTemplates[resourceTemplateId] = action.payload

  return newState
}

/**
 * Create a generated id so that this is a new resource.
 * The redux path will be something like ..., "kV5fjX2b1", "resourceTemplate:bf2:Monograph:Work"
 */
export const addResource = (state, action) => {
  const payload = action.payload
  const newState = { ...state }
  const rootNode = findNode(newState, payload.reduxPath)
  // TODO: Its possible that this should be addPropertyTypeRows
  rootNode[shortid.generate()] = { [payload.resourceTemplateId]: {} }
  return newState
}

const setRetrieveError = (state, action) => {
  const resourceTemplateId = action.payload
  const newState = { ...state }

  newState.editor.serverError = `There was a problem retrieving ${resourceTemplateId}`
  return newState
}

const selectorReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ROOT_RESOURCE_TEMPLATE_LOADED':
      return rootResourceTemplateLoaded(state, action)
    case 'ADD_RESOURCE':
      return addResource(state, action)
    case 'SET_ITEMS':
    case 'CHANGE_SELECTIONS':
      return setItemsOrSelections(state, action)
    case 'RETRIEVE_ERROR':
      return setRetrieveError(state, action)
    case 'SET_BASE_URL':
      return setBaseURL(state, action)
    case 'SHOW_GROUP_CHOOSER':
      return showGroupChooser(state, action)
    case 'CLOSE_GROUP_CHOOSER':
      return closeGroupChooser(state, action)
    case 'SET_LANG':
      return setMyItemsLang(state, action)
    case 'SHOW_RDF_PREVIEW':
      return showRdfPreview(state, action)
    case 'RESOURCE_TEMPLATE_LOADED':
      return resourceTemplateLoaded(state, action)
    case 'REFRESH_RESOURCE_TEMPLATE':
      return refreshResourceTemplate(state, action)
    case 'REMOVE_ITEM':
      return removeMyItem(state, action)
    case 'REMOVE_ALL_CONTENT':
      return removeAllContent(state, action)
    default:
      return state
  }
}

const appReducer = combineReducers({
  authenticate,
  selectorReducer,
})

export default appReducer
