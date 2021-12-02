export const hideModal = () => ({
  type: "HIDE_MODAL",
})

export const showModal = (name) => ({
  type: "SHOW_MODAL",
  payload: name,
})

export const showLangModal = (valueKey) => ({
  type: "SHOW_LANG_MODAL",
  payload: valueKey,
})

export const showMarcModal = (marc) => ({
  type: "SHOW_MARC_MODAL",
  payload: marc,
})
