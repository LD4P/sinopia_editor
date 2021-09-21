export const showCopyNewMessage = (oldUri) => ({
  type: "SHOW_COPY_NEW_MESSAGE",
  payload: {
    oldUri,
    timestamp: Date.now(),
  },
})

export const noop = () => {}
