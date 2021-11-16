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
      dispatch(
        validateAllRefResourceTemplatesExist(
          subjectTemplate.propertyTemplates,
          resourceTemplatePromises
        )
      ),
      dispatch(
        validateRepeatedPropertyTemplates(
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

const validateRepeatedPropertyTemplates =
  (propertyTemplates, resourceTemplatePromises) => (dispatch) => {
    const dupes = new Set()
    const found = {}
    return Promise.all(
      propertyTemplates.map((propertyTemplate) => {
        if (!_.isEmpty(propertyTemplate.uris)) {
          return Promise.all(
            Object.keys(propertyTemplate.uris).map((uri) => {
              if (_.isEmpty(propertyTemplate.valueSubjectTemplateKeys)) {
                pushFoundOrDupe(uri, null, found, dupes)
                return Promise.resolve()
              }
              return Promise.all(
                propertyTemplate.valueSubjectTemplateKeys.map(
                  (subjectTemplateKey) =>
                    dispatch(
                      loadResourceTemplateWithoutValidation(
                        subjectTemplateKey,
                        resourceTemplatePromises
                      )
                    )
                      .then((resourceTemplate) => {
                        pushFoundOrDupe(
                          uri,
                          resourceTemplate.class,
                          found,
                          dupes
                        )
                        return Promise.resolve()
                      })
                      // Some templates may not exist. This is not validated here.
                      .catch(() => {})
                )
              )
            })
          )
        }
      })
    ).then(() => {
      if (_.isEmpty(dupes)) return []

      return [
        `A property template may not use the same property URI as another property template (${Array.from(
          dupes
        ).join(
          ", "
        )}) unless both propery templates are of type nested resource and the nested resources are of different classes.`,
      ]
    })
  }

const pushFoundOrDupe = (uri, clazz, found, dupes) => {
  // Nested resource properties have clazz; other properties do not.
  // Other properties should not have same URI as any other property (including nested).
  // Nested resource properties should not have the same URI and class as any other nested resource property.
  const isNestedProperty = !!clazz
  if (found[uri]) {
    if (isNestedProperty) {
      // If a nested property and there are already classes for this URI, then check this class.
      if (Array.isArray(found[uri])) {
        // If this class found, then a dupe. Otherwise, add to list of classes for this URI.
        if (found[uri].includes(clazz)) {
          dupes.add(uri)
        } else {
          found[uri].add(clazz)
        }
      } else {
        // There is already a property, so a dupe.
        dupes.add(uri)
      }
    } else {
      dupes.add(uri)
    }
  } else if (isNestedProperty) {
    // For nested properties, keep track of classes.
    found[uri] = [clazz]
  } else {
    // For others, just set to true to indicate that the property has been found.
    found[uri] = true
  }
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
