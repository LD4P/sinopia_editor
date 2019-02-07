export const setItems = item => ({
  type: 'SET_ITEMS',
  payload: item
})

export const removeItem = item => ({
  type: 'REMOVE_ITEM',
  payload: item
})

export const removeAllItems = item => ({
  type: 'REMOVE_ALL',
  payload: item
})

export const changeSelections = item => ({
  type: 'CHANGE_SELECTIONS',
  payload: item
})

export const getLD = inputs => ({
  type: 'GENERATE_LD',
  payload: inputs
})

export const setLang = item => ({
  type: "SET_LANG",
  payload: item
})
