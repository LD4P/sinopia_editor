<<<<<<< HEAD
<<<<<<< HEAD
import { combineReducers } from 'redux'
import { generateLD } from './linkedData'
import lang from './lang'
import literal from './literal'
import lookups from './lookups'
import authenticate from './authenticate'

const appReducer = combineReducers({
  generateLD,
  lang,
  literal,
  lookups,
  authenticate
})
=======
=======
// Copyright 2018, 2019 Stanford University see Apache2.txt for license

import { createSelector } from 'reselect'
const { getResourceTemplate } = require('../sinopiaServerSpoof.js')

const resourceTemplateSelector = (state, id) => state[id]

const propertySelector = (state, rtId, id) => state[rtId][id]

export const getProperty = createSelector(
  [resourceTemplateSelector, propertySelector],
  (resourceTemplate, propertyURI)  => {
    return resourceTemplate[propertyURI]
  }
)
>>>>>>> resourceTemplateSelector, propertySelector, and getProperty functions, added

export const setResourceTemplate = (state, action) => {
  const rtKey = action.payload.id
>>>>>>> Started refactoring of Redux store

  let output = Object.create(state)
  output[rtKey] = {}
  action.payload.propertyTemplates.forEach((property) => {
    output[rtKey][property.propertyURI] = { items: [] }
    if (property.valueConstraint.defaults.length > 0) {
      property.valueConstraint.defaults.forEach((row) => {
        // This items payload needs to vary if type is literal or lookup
        output[rtKey][property.propertyURI].items.push(
          {
            value: row.defaultLiteral,
            uri: row.defaultURI
          }
        )
      })
    }
    if (property.valueConstraint.valueTemplateRefs.length > 0) {
      property.valueConstraint.valueTemplateRefs.map((row, i) => {
        // Should be recursive call to getResourceTemplate 
        output[rtKey][property.propertyURI] = { [row]: {} }
      })
    }
  })
  return output
}

const rootReducer = (state={}, action) => {
  switch(action.type) {
    case 'SET_RESOURCE_TEMPLATE':
      return setResourceTemplate(state, action)
    case 'SET_ITEMS':
      return setMyItems(state, action)
    case 'REMOVE_ITEM':
      return removeMyItem(state, action)
    case 'REMOVE_ALL_CONTENT':
      return removeAllContent(state, action)
    default:
      return state
  }
}

export default rootReducer
