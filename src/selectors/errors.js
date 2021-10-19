import { selectProperty, selectSubject, selectNormSubject } from "./resources"
import _ from "lodash"

/**
 * Determines if resource validation should be displayed.
 * @param {Object} state the redux state
 * @param {string} resourceKey of the resource to check; if omitted, current resource key is used
 * @return {boolean} true if resource validations should be displayed
 */
export const displayResourceValidations = (state, resourceKey) =>
  !!state.editor.resourceValidation[resourceKey]

export const hasValidationErrors = (state, resourceKey) => {
  const subject = selectNormSubject(state, resourceKey)
  return !_.isEmpty(subject?.descWithErrorPropertyKeys)
}

/**
 * @returns {function} a function that returns the errors for an error key
 */
export const selectErrors = (state, errorKey) => state.editor.errors[errorKey]

export const selectValidationErrors = (state, resourceKey) => {
  const subject = selectSubject(state, resourceKey)
  if (subject == null) return []

  const errors = []

  subject.descWithErrorPropertyKeys.forEach((propertyKey) => {
    const property = selectProperty(state, propertyKey)
    if (
      property.descWithErrorPropertyKeys.length === 1 &&
      property.values !== null
    ) {
      property.values.forEach((value) => {
        value.errors.forEach((error) => {
          const newError = {
            message: error,
            propertyKey: property.key,
            labelPath: property.labels,
          }
          errors.push(newError)
        })
      })
    }
  })
  return errors
}
