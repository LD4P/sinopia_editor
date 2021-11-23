export const showModal = (state, action) => setModal(state, action.payload)

export const hideModal = (state) => setModal(state, null)

export const showLangModal = (state, action) =>
  setModal(state, "LangModal", action.payload)

const setModal = (state, name, currentLangModalValue = null) => ({
  ...state,
  currentModal: name,
  currentLangModalValue,
})
