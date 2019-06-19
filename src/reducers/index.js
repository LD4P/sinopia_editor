// Copyright 2018, 2019 Stanford University see LICENSE for license
/* eslint complexity: ["warn", 13] */

import { combineReducers } from 'redux'
import shortid from 'shortid'
import authenticate from './authenticate'
import {
  removeAllContent, removeMyItem, setItemsOrSelections, setBaseURL, setMyItemsLang,
  showGroupChooser, closeGroupChooser, showRdfPreview,
} from './inputs'
import { defaultLangTemplate } from 'Utilities'


export const findNode = (selectorReducer, reduxPath) => {
  const items = reduxPath.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), selectorReducer)

  return items || {}
}

/*
 * TODO: Re-enable use of reselect's createSelector, will need to adjust
 * individual components InputLiteral, InputLookupQA, InputListLOC, etc.,
 * see https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances
 */
export const getProperty = (state, props) => {
  const result = findNode(state.selectorReducer, props.reduxPath)

  return result.items || []
}

/*
 * @returns {function} a function that returns true if validations should be displayed
 */
export const getDisplayValidations = state => findNode(state.selectorReducer, ['editor']).displayValidations

/**
 * @returns {function} a function that gets a resource template from state or undefined
 */
export const getResourceTemplate = (state, resourceTemplateId) => findNode(state.selectorReducer, ['entities', 'resourceTemplates'])[resourceTemplateId]


/**
 * @returns {function} a function that gets a property template from state or undefined
 */
export const getPropertyTemplate = (state, resourceTemplateId, propertyURI) => {
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)

  if (!resourceTemplate) {
    return
  }

  // Find the property template
  return resourceTemplate.propertyTemplates.find(propertyTemplate => propertyTemplate.propertyURI === propertyURI)
}

/**
 * This transforms the property template default values fetched from the server into redux state
 */
export const populatePropertyDefaults = (propertyTemplate) => {
  const defaults = propertyTemplate?.valueConstraint?.defaults || []

  return defaults.map(row => ({
    id: makeShortID(),
    content: row.defaultLiteral,
    uri: row.defaultURI,
    lang: defaultLangTemplate(),
  }))
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
 * @returns {{}} the new state of the redux store.
 */
export const refreshResourceTemplate = (state, action) => {
  const resourceTemplateId = Object.keys(state.resource).pop()
  const newResource = { resource: { [resourceTemplateId]: state.resource[resourceTemplateId] } }

  const newState = { ...state, ...newResource }

  const reduxPath = action.payload.reduxPath
  const propertyTemplate = action.payload.property

  if (reduxPath === undefined || reduxPath.length < 1) {
    return newState
  }
  const defaults = populatePropertyDefaults(propertyTemplate)
  const items = defaults.length > 0 ? { items: defaults } : {}
  const lastKey = reduxPath.pop()
  const lastObject = reduxPath.reduce((newState, key) => newState[key] = newState[key] || {}, newState)

  if (Object.keys(items).includes('items')) {
    lastObject[lastKey] = items
  } else {
    lastObject[lastKey] = {}
  }

  return newState
}

/**
 * Called when a top level resource template is loaded
 * the body of the resource template is in `action.payload'
 */
export const setResourceTemplate = (state, action) => {
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

  return newState
}

export const resourceTemplateLoaded = (state, action) => {
  const resourceTemplateId = action.payload.id
  const newState = { ...state }

  newState.entities.resourceTemplates[resourceTemplateId] = action.payload
  return newState
}

export const makeShortID = () => shortid.generate()

const selectorReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_RESOURCE_TEMPLATE':
      return setResourceTemplate(state, action)
    case 'SET_ITEMS':
    case 'CHANGE_SELECTIONS':
      return setItemsOrSelections(state, action)
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
