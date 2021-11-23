export const hideModal = () => ({
  type: "HIDE_MODAL",
})

export const showModal = (name) => ({
  type: "SHOW_MODAL",
  payload: name,
})
