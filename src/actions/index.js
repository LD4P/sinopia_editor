export const setItems = item => ({
  type: 'SET_ITEMS',
  payload: item
})

export const refreshResourceTemplate  = update => ({
  type: 'REFRESH_RESOURCE_TEMPLATE',
  payload: update
})

export const setResourceTemplate = resource_template => ({
  type: 'SET_RESOURCE_TEMPLATE',
  payload: resource_template
})

export const removeItem = item => ({
  type: 'REMOVE_ITEM',
  payload: item
})

export const removeAllContent = item => ({
  type: 'REMOVE_ALL_CONTENT',
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

//InputLOC uses the same action, trying a different one to keep functionality separate
export const changeQASelections = item => ({
  type: 'CHANGE_QA_SELECTIONS',
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

export const logIn = jwt => ({
  type: "LOG_IN",
  payload: jwt
})

export const logOut = () => ({
  type: "LOG_OUT"
})
