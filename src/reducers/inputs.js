// Copyright 2018, 2019 Stanford University see LICENSE for license

import Validator from '../Validator'

export const validate = (state, action = { payload: {} }) => new Validator(state).validate(action.payload.show)

export const removeAllContent = (state, action) => {
  const newState = { ...state }
  const reduxPath = action.payload.reduxPath
  let level = 0

  reduxPath.reduce((obj, key) => {
    level++
    if (level === reduxPath.length) {
      obj[key].items = []
    }

    return obj[key]
  }, newState)

  return validate(newState)
}

export const setMyItems = (state, action) => {
  const newState = { ...state }
  const reduxPath = action.payload.reduxPath
  let level = 0

  reduxPath.reduce((obj, key) => {
    level++
    if (level === reduxPath.length) {
      if ((key in obj) !== true || !Object.keys(obj[key]).includes('items')) {
        obj[key] = { items: [] }
      }
      action.payload.items.map((row) => {
        obj[key].items.push(row)
      })
    }
    if (!Object.keys(obj).includes(key)) {
      obj[key] = {}
    }

    return obj[key]
  }, newState)

  return validate(newState)
}

export const setMyItemsLang = (state, action) => {
  const newState = { ...state }
  const reduxPath = action.payload.reduxPath
  let level = 0

  reduxPath.reduce((obj, key) => {
    level++
    if (level === reduxPath.length) {
      if ((key in obj) !== true) {
        obj[key] = { items: [] }
      }

      const payloadItem = obj[key].items.find(item => item.id === action.payload.id)

      if (payloadItem) {
        payloadItem.lang = { items: action.payload.items }
      }
    }

    return obj[key]
  }, newState)

  return newState
}

export const setMySelections = (state, action) => {
  const newState = { ...state }
  const reduxPath = action.payload.reduxPath
  let level = 0

  reduxPath.reduce((obj, key) => {
    level++
    if (level === reduxPath.length) {
      if ((key in obj) !== true) {
        obj[key] = { items: [] }
      }
      obj[key].items = action.payload.items
    }

    return obj[key]
  }, newState)

  return validate(newState)
}

export const setBaseURL = (state, action) => {
  const newState = { ...state }

  // Is there ever more than one base node?
  Object.values(newState.resource).forEach((value) => {
    value.resourceURI = action.payload
  })

  return newState
}

export const removeMyItem = (state, action) => {
  const newState = { ...state }
  const reduxPath = action.payload.reduxPath
  let level = 0

  reduxPath.reduce((obj, key) => {
    level++
    if (level === reduxPath.length) {
      obj[key].items = obj[key].items.filter(
        row => row.id !== action.payload.id,
      )
    }

    return obj[key]
  }, newState)

  return validate(newState)
}
