export const clearFlashMessages = () => ({
  type: 'CLEAR_FLASH_MESSAGES',
})

export const setFlashMessages = messages => ({
  type: 'SET_FLASH_MESSAGES',
  messages,
})
