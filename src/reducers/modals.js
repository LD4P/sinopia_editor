export const showModal = (state, action) => setModal(state, action.payload)

export const hideModal = (state) => setModal(state, null)

const setModal = (state, name) => ({
  ...state,
  currentModal: name,
})
