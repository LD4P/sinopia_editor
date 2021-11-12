import { addError } from "actions/errors"
import _ from "lodash"
import { loadResourceTemplateWithoutValidation } from "./templates"

/**
 * Helper methods that should only be used in 'actionCreators/templates'
 */

/**
 * A thunk that validates a subject template model.
 * Note that this may involve loading additional subject templates.
 * @return [Array<String>] errors
 */
export const validateTemplates =
  (subjectTemplate, resourceTemplatePromises, errorKey) => (dispatch) =>
    Promise.all([
      Promise.resolve(validateSubjectTemplate(subjectTemplate)),
      Promise.resolve(validateSuppressible(subjectTemplate)),
      Promise.resolve(
        validatePropertyTemplates(subjectTemplate.propertyTemplates)
      ),
      Promise.resolve(
        validateRepeatedPropertyTemplates(subjectTemplate.propertyTemplates)
      ),
      dispatch(
        validateAllRefResourceTemplatesExist(
          subjectTemplate.propertyTemplates,
          resourceTemplatePromises
        )
      ),
      dispatch(
        validateAllUniqueResourceURIs(
          subjectTemplate.propertyTemplates,
          resourceTemplatePromises
        )
      ),
    ]).then((errors) => {
      const flatErrors = errors.flat()
      flatErrors.forEach((error) => dispatch(addError(errorKey, error)))
      return _.isEmpty(flatErrors)
    })

const validateSubjectTemplate = (template) => {
  const errors = []
  if (!template.id)
    errors.push("Resource template id is missing from resource template.")
  if (!template.class)
    errors.push("Resource template class is missing from resource template.")
  if (!template.label)
    errors.push("Resource template label is missing from resource template.")
  return errors
}

const validateSuppressible = (template) => {
  if (!template.suppressible) return []

  if (template.propertyTemplates.length !== 1)
    return ["A suppressible template must have one property template."]
  if (template.propertyTemplates[0].type !== "uri")
    return ["The property for a suppressible template must be a URI or lookup."]
  return []
}

const validatePropertyTemplates = (propertyTemplates) => {
  const errors = []
  propertyTemplates.forEach((template) =>
    errors.push(validatePropertyTemplate(template))
  )
  return errors.flat()
}

const validatePropertyTemplate = (template) => {
  const errors = []
  const firstUri = _.first(Object.keys(template.uris || {}))
  if (_.isEmpty(template.uris)) {
    errors.push("Property template URI is required.")
    return errors
  }
  if (!template.label)
    errors.push(`Property template label is required for ${firstUri}.`)
  if (!template.type)
    errors.push(
      `Cannot determine type for ${firstUri}. Must be resource, lookup, or literal.`
    )
  if (!template.component)
    errors.push(`Cannot determine component for ${firstUri}.`)
  template.authorities.forEach((authority) => {
    if (!authority.label)
      errors.push(`Misconfigured authority ${authority.uri} for ${firstUri}.`)
  })
  if (
    template.type === "resource" &&
    _.isEmpty(template.valueSubjectTemplateKeys)
  ) {
    errors.push(
      `The field "${template.label}" with property "${_.first(
        Object.keys(template.uris)
      )}" has type nested resource, but does not specify a template in Nested resource attributes.`
    )
  }
  return errors
}

const validateRepeatedPropertyTemplates = (propertyTemplates) => {
  const dupes = []
  const propertyTemplateUris = []
  propertyTemplates.forEach((propertyTemplate) => {
    if (!_.isEmpty(propertyTemplate.uris)) {
      Object.keys(propertyTemplate.uris).forEach((uri) => {
        if (propertyTemplateUris.includes(uri)) {
          dupes.push(uri)
        } else {
          propertyTemplateUris.push(uri)
        }
      })
    }
  })
  if (dupes.length > 0) {
    return [
      `Repeated property templates with same property URI (${dupes.join(
        ", "
      )}) are not allowed.`,
    ]
  }
  return []
}

const validateAllRefResourceTemplatesExist =
  (propertyTemplates, resourceTemplatePromises) => (dispatch) =>
    Promise.all(
      propertyTemplates.map((template) =>
        dispatch(
          validateRefResourceTemplatesExist(template, resourceTemplatePromises)
        )
      )
    ).then((missingResourceTemplateIds) => {
      // If misssing, then write errors for uniq
      const uniqMissingResourceTemplateIds = _.uniq(
        missingResourceTemplateIds.flat()
      )
      if (_.isEmpty(uniqMissingResourceTemplateIds)) return []
      return [
        `The following referenced resource templates are not available in Sinopia: ${uniqMissingResourceTemplateIds.join(
          ", "
        )}`,
      ]
    })

/**
 * Validates that all value template refs exist.
 */
const validateRefResourceTemplatesExist =
  (propertyTemplate, resourceTemplatePromises) => (dispatch) => {
    if (_.isEmpty(propertyTemplate.valueSubjectTemplateKeys))
      return Promise.resolve([])

    return Promise.all(
      propertyTemplate.valueSubjectTemplateKeys.map((resourceTemplateId) =>
        dispatch(
          loadResourceTemplateWithoutValidation(
            resourceTemplateId,
            resourceTemplatePromises
          )
        )
          .then(() => null)
          .catch(() => resourceTemplateId)
      )
    ).then((missingResourceTemplateIds) =>
      _.compact(missingResourceTemplateIds)
    )
  }

const validateAllUniqueResourceURIs =
  (propertyTemplates, resourceTemplatePromises) => (dispatch) =>
    Promise.all(
      propertyTemplates.map((propertyTemplate) =>
        dispatch(
          validateUniqueResourceURIs(propertyTemplate, resourceTemplatePromises)
        )
      )
    ).then((errors) => errors.flat())

/**
 * Validates that all value template refs have unique resource URIs.
 */
const validateUniqueResourceURIs =
  (propertyTemplate, resourceTemplatePromises) => (dispatch) => {
    if (_.isEmpty(propertyTemplate.valueSubjectTemplateKeys))
      return Promise.resolve([])

    return Promise.all(
      propertyTemplate.valueSubjectTemplateKeys.map((resourceTemplateId) =>
        dispatch(
          loadResourceTemplateWithoutValidation(
            resourceTemplateId,
            resourceTemplatePromises
          )
        )
          .then((subjectTemplate) => [
            subjectTemplate.class,
            subjectTemplate.id,
          ])
          .catch(() => {
            /* nothing */
          })
      )
    ).then((results) => {
      const classResourceTemplateIds = {}
      _.compact(results).forEach((result) => {
        const clazz = result[0]
        const resourceTemplateId = result[1]
        if (!classResourceTemplateIds[clazz])
          classResourceTemplateIds[clazz] = []
        classResourceTemplateIds[clazz].push(resourceTemplateId)
      })

      const multipleClasses = Object.keys(classResourceTemplateIds).filter(
        (clazz) => classResourceTemplateIds[clazz].length > 1
      )
      return multipleClasses.map((clazz) => {
        const classIdsStr = classResourceTemplateIds[clazz].join(", ")
        return `The following resource templates references for ${_.first(
          Object.keys(propertyTemplate.uris)
        )} have the same class (${clazz}), but must be unique: ${classIdsStr}`
      })
    })
  }

export const noop = () => {}
