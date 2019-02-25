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

export const setResourceTemplate = (state, action) => {
  const rtKey = action.payload.id
>>>>>>> Started refactoring of Redux store

  let output = Object.create(state)
  output[rtKey] = {}
  action.payload.propertyTemplates.forEach((property) => {
    output[rtKey][property.propertyURI] = []
    if (property.valueConstraint.defaults.length > 0) {
      property.valueConstraint.defaults.forEach((row) => {
        output[rtKey][property.propertyURI].push(
          {
            value: row.defaultLiteral,
            uri: row.defaultURI
          }
        )
      })
    }
    if (property.valueConstraint.valueTemplateRefs.length > 0) {
      property.valueConstraint.valueTemplateRefs.forEach((row) => {
        output[row] = {} // Should be a Sinopia Server?
        output[rtKey][property.propertyURI].push(
          {
            resourceTemplate: row
          }
        )
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
