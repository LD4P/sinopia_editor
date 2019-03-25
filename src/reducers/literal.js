// Copyright 2018, 2019 Stanford University see Apache2.txt for license

export const removeAllContent = (state, action) => {
  let newState = Object.assign({}, state)
  newState[action.payload.rtId][action.payload.uri].items = []
  return newState
}

export const setMyItems = (state, action) => {
  let newState = Object.assign({}, state)
  action.payload.items.map((row) => {
    newState[action.payload.rtId][action.payload.uri].items.push(row)
  })
  return newState
}

export const removeMyItem = (state, action) => {
  const newState = Object.assign({}, state)
  const newItems = newState[action.payload.rtId][action.payload.uri].items.filter(
    row => row.id != action.payload.id)
  newState[action.payload.rtId][action.payload.uri].items = newItems
  return newState
}
