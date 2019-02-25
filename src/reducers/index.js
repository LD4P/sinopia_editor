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
    console.log(`Property ${property.propertyLabel} ${property.valueConstraint.defaults.length}`)
    if (property.valueConstraint.defaults.length > 0) {
      property.valueConstraint.defaults.forEach((row) => {
        output[rtKey][property.propertyURI].push(
          {
            value: row.defaultLiteral,
            uri: row.defaultURI
          }
        )
      })
      // property.valueConstrant.defaults.forEach((row) => {
      //   console.log(`\t${row}`)
        // output[rtKey][property.propertyURI].push(
        //   {
        //     value: row.defaultLiteral,
        //     uri: row.defaultURI
        //   }
        // )
      // })
    }
    // console.log(`\tdefault? ${Object.keys(property.valueConstrant)}`)
    // property.valueConstrant.defaults.forEach((row) => {
    //   console.log(`Property ${property.propertyLabel} len=${row.length}`)
      // output[rtKey][property.propertyURI].push(
      //   {
      //     value: default.defaultLiteral,
      //     uri: default.defaultURI
      //   }
      // )
    // })
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
