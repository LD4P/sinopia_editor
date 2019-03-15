// Copyright 2018, 2019 Stanford University see Apache2.txt for license
import { combineReducers } from 'redux'
import { createSelector } from 'reselect'
import { generateLD } from './linkedData'
import lang from './lang'
import authenticate from './authenticate'
import { removeAllContent, setMyItems, removeMyItem } from './literal'


const resourceTemplateSelector = (state, props) => {

  const resTemp = state.selectorReducer[props.rtId]
  if (resTemp == undefined) {
    return state
  }
  let items
  if (props.propertyTemplate.propertyURI in resTemp) {
    items = resTemp[props.propertyTemplate.propertyURI]
  } else {
    resTemp[props.propertyTemplate.propertyURI] = []
    items = []
  }
  return items
}

export const getProperty = createSelector(
  [ resourceTemplateSelector ],
  (propertyURI) => {
    return propertyURI.items
  }
)



export const setResourceTemplate = (state, action) => {
  const rtKey = action.payload.id

  let output = Object.create(state)
  output[rtKey] = {}
  action.payload.propertyTemplates.forEach((property) => {
    output[rtKey][property.propertyURI] = { items: [] }
    if (property.valueConstraint.defaults && property.valueConstraint.defaults.length > 0) {
      property.valueConstraint.defaults.forEach((row) => {
        // This items payload needs to vary if type is literal or lookup
        output[rtKey][property.propertyURI].items.push(
          {
            content: row.defaultLiteral,
            uri: row.defaultURI
          }
        )
      })
    }
    if (property.valueConstraint.valueTemplateRefs.length > 0) {
      output[rtKey][property.propertyURI] = {}
      property.valueConstraint.valueTemplateRefs.map((row) => {
        output[rtKey][property.propertyURI][row] = {}
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

export default appReducer
