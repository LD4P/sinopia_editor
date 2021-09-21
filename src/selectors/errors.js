import { selectProperty, selectSubject } from "./resources"
import _ from "lodash"

/**
 * Determines if resource validation should be displayed.
 * @param {Object} state the redux state
 * @param {string} resourceKey of the resource to check; if omitted, current resource key is used
 * @return {boolean} true if resource validations should be displayed
 */
export const displayResourceValidations = (state, resourceKey) =>
  state.editor.resourceValidation[resourceKey] || false

export const hasValidationErrors = (state, resourceKey) => {
  if (!resourceKey) return false

  const subject = selectSubject(state, resourceKey)
  return !_.isEmpty(subject.descWithErrorPropertyKeys)
}

/**
 * @returns {function} a function that returns the errors for an error key
 */
export const selectErrors = (state, errorKey) =>
  state.editor.errors[errorKey] || []

export const selectValidationErrors = (state, resourceKey) =>
  findValidationErrors(state, resourceKey, [])

// Searches the subject for errors. Also, sets label path for each error.
const findValidationErrors = (state, subjectKey, labelPath) => {
  const subject = selectSubject(state, subjectKey)
  if (subject == null) return []

  const newLabelPath = [...labelPath, subject.subjectTemplate.label]
  const errors = []
  subject.propertyKeys.forEach((propertyKey) => {
    const property = selectProperty(state, propertyKey)
    if (!_.isEmpty(property.errors)) {
      property.errors.forEach((error) => {
        const newError = {
          message: error,
          propertyKey: property.key,
          labelPath: [...newLabelPath, property.propertyTemplate.label],
        }
        errors.push(newError)
      })
    }
    if (
      property.propertyTemplate.type === "resource" &&
      !_.isEmpty(property.values)
    ) {
      property.values.forEach((value) => {
        if (value.valueSubjectKey) {
          const childErrors = findValidationErrors(
            state,
            value.valueSubjectKey,
            newLabelPath
          )
          childErrors.forEach((error) => errors.push(error))
        }
      })
    }
  })
  return errors
}
