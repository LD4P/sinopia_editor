// Copyright 2019 Stanford University see LICENSE for license

import { foundResourceTemplate } from 'sinopiaServer'
import { getTagNameForPropertyTemplate } from 'utilities/propertyTemplates'

/**
 * Validates a resource template.
 * @param {Object} resourceTemplate to validate
 * @param {Array<string>} resourceTemplatesIds that are available
 * @return {Promise<Array<string>>} reasons that validation failed
 */
const validateResourceTemplate = async resourceTemplate => [].concat(
  validateRepeatedPropertyTemplates(resourceTemplate),
  validateNoDefaultURIForLiterals(resourceTemplate),
  validateNoDefaultsForTemplateRefs(resourceTemplate),
  await validateTemplateRefsExist(resourceTemplate),
  validateKnownTagName(resourceTemplate),
)

/**
 * Validates that a resource template does not contain repeated property templates.
 * @param {Object} resourceTemplate to validate
 * @return {Array<string>} reasons that validation failed if invalid
 */
const validateRepeatedPropertyTemplates = (resourceTemplate) => {
  const dupes = []
  const propertyTemplateIds = []
  resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
    const propertyURI = propertyTemplate.propertyURI
    if (propertyTemplateIds.indexOf(propertyURI) !== -1) {
      dupes.push(propertyURI)
    } else {
      propertyTemplateIds.push(propertyURI)
    }
  })
  if (dupes.length > 0) {
    return [`Repeated property templates with same property URI (${dupes}) are not allowed.`]
  }
  return []
}

/**
 * Validates that literal property templates do not have a default URI.
 *
 * Blanks are allowed, as Profile Editor adds them by default.
 * @param {Object} resourceTemplate to validate
 * @return {Array<string>} reasons that validation failed if invalid
 */
const validateNoDefaultURIForLiterals = (resourceTemplate) => {
  const propertyTemplateIds = new Set()
  resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
    if (propertyTemplate.type === 'literal') {
      const defaults = propertyTemplate?.valueConstraint?.defaults || []
      defaults.forEach((defaultItem) => {
        if (defaultItem.defaultURI !== undefined && defaultItem.defaultURI !== '') {
          propertyTemplateIds.add(propertyTemplate.propertyURI)
        }
      })
    }
  })
  if (propertyTemplateIds.size > 0) {
    return [`Literal property templates (${Array.from(propertyTemplateIds)}) cannot have default URIs.`]
  }
  return []
}

/**
 * Validates that property templates that have valueTemplateRefs do not have a defaults.
 * @param {Object} resourceTemplate to validate
 * @return {Array<string} reasons that validation failed if invalid
 */
const validateNoDefaultsForTemplateRefs = (resourceTemplate) => {
  const propertyTemplateIds = new Set()
  resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
    const valueConstraint = propertyTemplate.valueConstraint
    const defaults = valueConstraint?.defaults || []
    const refs = valueConstraint?.valueTemplateRefs || []

    if (defaults.length > 0 && refs.length > 0) {
      propertyTemplateIds.add(propertyTemplate.propertyURI)
    }
  })
  if (propertyTemplateIds.size > 0) {
    return [`Property templates (${Array.from(propertyTemplateIds)}) cannot have both defaults and valueTemplateRefs.`]
  }

  return []
}

/**
 * Validates that property templates have known types or lookups.
 * @param {Object} resourceTemplate to validate
 * @return {Array<string>} reasons that validation failed if invalid
 */
const validateKnownTagName = (resourceTemplate) => {
  const propertyTemplateIds = []
  resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
    try {
      getTagNameForPropertyTemplate(propertyTemplate)
    } catch {
      propertyTemplateIds.push(propertyTemplate.propertyURI)
    }
  })
  if (propertyTemplateIds.length > 0) {
    return [`The following property templates have unknown types or lookups: ${propertyTemplateIds.join(', ')}`]
  }
  return []
}

/**
 * Validates that all value template refs exist.
 * @param {Object} resourceTemplate to validate
 * @return {Promise<Array<string>>} reasons that validation failed if invalid
 */
const validateTemplateRefsExist = async (resourceTemplate) => {
  const missingResourceTemplateIds = new Set()
  await Promise.all(resourceTemplate.propertyTemplates.map(async (propertyTemplate) => {
    const refs = propertyTemplate.valueConstraint?.valueTemplateRefs || []
    await Promise.all(refs.map(async (resourceTemplateIdRef) => {
      const found = await foundResourceTemplate(resourceTemplateIdRef)
      if (!found) {
        missingResourceTemplateIds.add(resourceTemplateIdRef)
      }
    }))
  }))
  if (missingResourceTemplateIds.size > 0) {
    return [`The following referenced resource templates are not available in Sinopia: ${Array.from(missingResourceTemplateIds).join(', ')}`]
  }
  return []
}


export default validateResourceTemplate
