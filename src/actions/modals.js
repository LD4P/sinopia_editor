export const clearModalMessages = () => ({
  type: "CLEAR_MODAL_MESSAGES",
})

export const addModalMessage = (message) => ({
  type: "ADD_MODAL_MESSAGE",
  payload: message,
})

export const hideModal = () => ({
  type: "HIDE_MODAL",
})

export const showModal = (name) => ({
  type: "SHOW_MODAL",
  payload: name,
})
