// Copyright 2018, 2019 Stanford University see Apache2.txt for license

export const removeAllContent = (state, action) => {
  let newState = Object.assign({}, state)
  newState[action.payload.rtId][action.payload.uri].items = []
  return newState
}

export const setMyItems = (state, action) => {
  let newState = Object.assign({}, state)
  const reduxPath = action.payload.reduxPath
  let level = 0
  reduxPath.reduce((obj, key) => {
    level++
    console.warn(obj, key)
    if (level === reduxPath.length) {
      action.payload.items.map((row) => {
        obj[key].items.push(row)
      })
    }
    return obj[key]
  }, newState)
  return newState
}

export const removeMyItem = (state, action) => {
  const newState = Object.assign({}, state)
  const newItems = newState[action.payload.rtId][action.payload.uri].items.filter(
    row => row.id != action.payload.id)
  newState[action.payload.rtId][action.payload.uri].items = newItems
  return newState
}
