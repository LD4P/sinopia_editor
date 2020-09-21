export const clearModalMessages = (state) => ({
  ...state,
  modal: {
    ...state.modal,
    messages: [],
  },
})

export const addModalMessage = (state, action) => ({
  ...state,
  modal: {
    ...state.modal,
    messages: [...state.modal.messages, action.payload],
  },
})

export const showModal = (state, action) => setModal(state, action.payload)

export const hideModal = (state) => setModal(state, null)

const setModal = (state, name) => ({
  ...state,
  modal: {
    ...state.modal,
    name,
  },
})
