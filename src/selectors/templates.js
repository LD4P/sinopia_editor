/**
 * Selects a subject template by key.
 * @param [Object] state
 * @param [string] key
 * @return [Object] subject template
 */
export const selectSubjectTemplate = (state, key) =>
  state.entities.subjectTemplates[key]

/**
 * Selects a property template by key.
 * @param [Object] state
 * @param [string] key
 * @return [Object] property template
 */
export const selectPropertyTemplate = (state, key) =>
  state.entities.propertyTemplates[key]

/**
 * Selects a subject template and associated property templates by key.
 * @param [Object] state
 * @param [string] key
 * @return [Object] subject template
 */
export const selectSubjectAndPropertyTemplates = (state, key) => {
  const subjectTemplate = selectSubjectTemplate(state, key)
  if (!subjectTemplate) return null

  const newSubjectTemplate = { ...subjectTemplate }
  newSubjectTemplate.propertyTemplates =
    subjectTemplate.propertyTemplateKeys.map((propertyTemplateKey) =>
      selectPropertyTemplate(state, propertyTemplateKey)
    )

  return newSubjectTemplate
}

export const selectSubjectTemplateForSubject = (state, subjectKey) => {
  const subjectTemplateKey =
    state.entities.subjects[subjectKey]?.subjectTemplateKey
  return selectSubjectTemplate(state, subjectTemplateKey)
}

export const selectPropertyTemplateForProperty = (state, propertyKey) => {
  const propertyTemplateKey =
    state.entities.properties[propertyKey]?.propertyTemplateKey
  return selectPropertyTemplate(state, propertyTemplateKey)
}
