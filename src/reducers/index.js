// Copyright 2018, 2019 Stanford University see Apache2.txt for license
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import lang from './lang'
import authenticate from './authenticate'
import { removeAllContent, setMyItems, removeMyItem } from './literal'
import shortid from 'shortid'
const _ = require('lodash')

const inputPropertySelector = (state, props) => {
  const reduxPath = props.reduxPath
  let items = reduxPath.reduce((obj, key) =>
      (obj && obj[key] !== 'undefined') ? obj[key] : undefined,
    state.selectorReducer)
  if (items === undefined) {
    items = []
  }
  return items
}

export const getProperty = createSelector(
  [ inputPropertySelector ],
  (propertyURI) => {
    return propertyURI.items
  }
)

export const getAllRdf = (state, action) => {
  // TODO: Fix as part of issue #481 - it should return ... jsonld?
  let output = Object.create(state)
  // TODO: temporary no-op to pass eslint ...
  action.payload
  return output.selectorReducer
}

export const refreshResourceTemplate = (state, action) => {
  let newState = Object.assign({}, state)
  const reduxPath = action.payload.reduxPath
  if (reduxPath === undefined || reduxPath.length < 1) {
    return newState
  }
  const items = action.payload.defaults || { items: [] }

  const lastKey = reduxPath.pop()
  const lastObject = reduxPath.reduce((newState, key) =>
      newState[key] = newState[key] || {},
    newState)
  if (Object.keys(items).includes('items')) {
    lastObject[lastKey] = items
  } else {
    lastObject[lastKey] = { items: items }
  }
  return newState
}

export const setResourceTemplate = (state, action) => {
  const rtKey = action.payload.id

  let output = Object.create(state)
  output[rtKey] = {}
  action.payload.propertyTemplates.forEach((property) => {
    output[rtKey][property.propertyURI] = { items: [] }
    if (_.has(property.valueConstraint, 'defaults')) {
      if (property.valueConstraint.defaults.length > 0) {
        property.valueConstraint.defaults.forEach((row) => {
          // This items payload needs to vary if type is literal or lookup

          output[rtKey][property.propertyURI].items.push(
            {
              id: makeShortID(),
              content: row.defaultLiteral,
              uri: row.defaultURI
            }
          )
        })
      }
    }
    if (_.has(property.valueConstraint, 'valueTemplateRefs')) {
      if (property.valueConstraint.valueTemplateRefs.length > 0) {
        output[rtKey][property.propertyURI] = {}
        property.valueConstraint.valueTemplateRefs.map((row) => {
          output[rtKey][property.propertyURI][row] = {}
        })
      }
    }
  })
  return output
}

export const makeShortID = () => {
  return shortid.generate()
}

const selectorReducer = (state={}, action) => {
  switch(action.type) {
    case 'SET_RESOURCE_TEMPLATE':
      return setResourceTemplate(state, action)
    case 'SET_ITEMS':
      return setMyItems(state, action)
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
  selectorReducer
})

export default appReducer
