// Copyright 2018 Stanford University see LICENSE for license

const DEFAULT_STATE = {
  formData: [],
}

const changeMyItems = (state, action) => {
  const newFormData = state.formData.slice(0)
  let needNewItemArray = true

  for (const field of newFormData) {
    if (field.id === action.payload.id) {
      field.items = action.payload.items
      needNewItemArray = false
      break
    }
  }

  if (needNewItemArray) {
    newFormData.push(action.payload)
  }

  return { formData: newFormData }
}

const lookups = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'CHANGE_SELECTIONS':
      return changeMyItems(state, action)
    default:
      return state
  }
}

export default lookups
