import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { generateLD } from './linkedData'
import lang from './lang'
import authenticate from './authenticate'
import { removeMyItem, setMyItems } from './literal'


const removeAllContent = () => {

}

const resourceTemplateSelector = (state, id) => state[id]

const propertySelector = (state, rtId, id) => state[rtId][id]

export const getProperty = createSelector(
  [resourceTemplateSelector, propertySelector],
  (resourceTemplate, propertyURI)  => {
    return resourceTemplate[propertyURI]
  }
)


export const setResourceTemplate = (state, action) => {
  const rtKey = action.payload.id

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
      property.valueConstraint.valueTemplateRefs.map((row) => {
        // Should be recursive call to getResourceTemplate
        output[rtKey][property.propertyURI] = { [row]: {} }
      })
    }
  })
  return output
}

const selectorReducer = (state={}, action) => {
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

const appReducer = combineReducers({
  generateLD,
  lang,
  authenticate,
  selectorReducer
})

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
>>>>>>> Started refactoring of Redux store
