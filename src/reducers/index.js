// Copyright 2018, 2019 Stanford University see LICENSE for license

import { combineReducers } from 'redux'
import shortid from 'shortid'
import lang from './lang'
import authenticate from './authenticate'
import {
  removeAllContent, removeMyItem, setMyItems, setMySelections,
} from './inputs'
import GraphBuilder from '../GraphBuilder'

const inputPropertySelector = (state, props) => {
  const reduxPath = props.reduxPath
  let items = reduxPath.reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined), state.selectorReducer)

  if (items === undefined) {
    items = []
  }

  return items
}

/*
 * TODO: Re-enable use of reselect's createSelector, will need to adjust
 * individual components InputLiteral, InputLookupQA, InputListLOC, etc.,
 * see https://github.com/reduxjs/reselect#sharing-selectors-with-props-across-multiple-component-instances
 */
export const getProperty = (state, props) => {
  const result = inputPropertySelector(state, props)

  return result.items || []
}

/**
 * @returns {string} the serialized RDF
 */
export const getAllRdf = (state, action) => {
  const output = Object.create(state)

  // TODO: temporary no-op to pass eslint ...
  action.payload

  const graph = new GraphBuilder(output.selectorReducer).graph

  return graph.toString()
}


/**
 * This transforms the template fetched from the server into redux state
 */
export const populatePropertyDefaults = (propertyTemplate) => {
  const defaults = []

  if (propertyTemplate === undefined || propertyTemplate === null || Object.keys(propertyTemplate).length < 1) {
    return defaults
  }
  if (propertyTemplate?.valueConstraint?.defaults && propertyTemplate.valueConstraint.defaults.length > 0) {
    propertyTemplate.valueConstraint.defaults.map((row) => {
      defaults.push({
        id: makeShortID(),
        content: row.defaultLiteral,
        uri: row.defaultURI,
      })
    })
  }

  return defaults
}

export const refreshResourceTemplate = (state, action) => {
  const newState = { ...state }
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
 * Called when a resource template is loaded
 */
export const setResourceTemplate = (state, action) => {
  const rtKey = action.payload.id
  let output = state

  action.payload.propertyTemplates.forEach((property) => {
    const propertyAction = {
      payload: {
        reduxPath: [rtKey, property.propertyURI],
        property,
      },
    }

    output = refreshResourceTemplate(output, propertyAction)
  })

  return output
}

export const makeShortID = () => shortid.generate()

const selectorReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_RESOURCE_TEMPLATE':
      return setResourceTemplate(state, action)
    case 'SET_ITEMS':
      return setMyItems(state, action)
    case 'CHANGE_SELECTIONS':
      return setMySelections(state, action)
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
  lang,
  authenticate,
  selectorReducer,
})

export default appReducer
