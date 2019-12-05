export const clearModalMessages = () => ({
  type: 'CLEAR_MODAL_MESSAGES',
})

export const addModalMessage = (message) => ({
  type: 'ADD_MODAL_MESSAGE',
  message,
})

export const showModal = (name) => ({
  type: 'SHOW_MODAL',
  payload: name,
})

export const hideModal = () => ({
  type: 'HIDE_MODAL',
})
