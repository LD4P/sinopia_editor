import _ from "lodash"

export const showModal = (state, action) => setModal(state, action.payload)

export const hideModal = (state) => setModal(state, null)

export const showLangModal = (state, action) =>
  setModal(state, "LangModal", { currentLangModalValue: action.payload })

export const showMarcModal = (state, action) =>
  setModal(state, "MarcModal", { marc: action.payload })

const setModal = (
  state,
  name,
  { currentLangModalValue = null, marc = null } = {}
) => {
  let newCurrentModal
  if (name) {
    newCurrentModal = [...state.currentModal, name]
  } else {
    newCurrentModal = _.dropRight(state.currentModal)
  }
  return {
    ...state,
    currentModal: newCurrentModal,
    currentLangModalValue,
    marc,
  }
}
