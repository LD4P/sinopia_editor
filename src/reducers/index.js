import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { generateLD } from './linkedData'
import lang from './lang'
import authenticate from './authenticate'
import { removeMyItem, setMyItems } from './literal'

const removeAllContent = () => {
  // TODO: write me?
}

const resourceTemplateSelector = (state, id) => state[id]

const propertySelector = (state, rtId, id) => state[rtId][id]

export const getProperty = createSelector(
  [resourceTemplateSelector, propertySelector],
  (resourceTemplate, propertyURI) => {
    return resourceTemplate[propertyURI]
  }
)

export const setResourceTemplate = async (state, action) => {
  let resourceTemplate = await action.payload

  console.dir(resourceTemplate)
  let rtKey = resourceTemplate.id

  let output = Object.create(state)
  output[rtKey] = {}
  resourceTemplate.propertyTemplates.forEach((property) => {
    console.dir(property)
    output[rtKey][property.propertyURI] = { items: [] }
    if (property.valueConstraint.defaults.length > 0) {
      property.valueConstraint.defaults.forEach((row) => {
        // This item's payload needs to vary if type is literal or lookup
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
        output[rtKey][property.propertyURI] = { [row]: {} }
      })
    }
  })
  console.log('returning:')
  console.dir(output)
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

export default appReducer
