export const addTemplateHistory = (resourceTemplate) => ({
  type: 'ADD_TEMPLATE_HISTORY',
  payload: resourceTemplate,
})

export const addTemplateHistoryByResult = (result) => ({
  type: 'ADD_TEMPLATE_HISTORY_BY_RESULT',
  payload: result,
})
