export const addTemplateHistory = (resourceTemplate) => ({
  type: 'ADD_TEMPLATE_HISTORY',
  payload: resourceTemplate,
})

export const addTemplates = (subjectTemplate, propertyTemplates) => ({
  type: 'ADD_TEMPLATES',
  payload: { subjectTemplate, propertyTemplates },
})
