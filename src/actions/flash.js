export const clearTemplateMessages = () => ({
  type: 'CLEAR_TEMPLATE_MESSAGES',
})

export const setTemplateMessages = messages => ({
  type: 'SET_TEMPLATE_MESSAGES',
  messages,
})
