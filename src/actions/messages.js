export const clearTemplateMessages = () => ({
  type: 'CLEAR_TEMPLATE_MESSAGES',
})

export const setTemplateMessages = (messages) => ({
  type: 'SET_TEMPLATE_MESSAGES',
  payload: messages,
})

export const showCopyNewMessage = (oldUri) => ({
  type: 'SHOW_COPY_NEW_MESSAGE',
  payload: oldUri,
})
