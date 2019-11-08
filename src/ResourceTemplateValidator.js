// Copyright 2019 Stanford University see LICENSE for license

import { foundResourceTemplate, getResourceTemplate } from 'sinopiaServer'
import { getTagNameForPropertyTemplate } from 'utilities/propertyTemplates'
import { findAuthorityConfig } from 'utilities/authorityConfig'
import _ from 'lodash'

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
  validateTypeAheadAuthorityURIs(resourceTemplate),
  await validateTemplateRefsExist(resourceTemplate),
  await validateUniqueResourceURIs(resourceTemplate),
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
    return [formatError(`Repeated property templates with same property URI (${dupes}) are not allowed.`, resourceTemplate)]
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
    return [formatError(`Literal property templates (${Array.from(propertyTemplateIds)}) cannot have default URIs.`, resourceTemplate)]
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
    return [formatError(`Property templates (${Array.from(propertyTemplateIds)}) cannot have both defaults and valueTemplateRefs.`, resourceTemplate)]
  }

  return []
}

/**
 * Validates that property templates with URIs in valueConstraints are found in authorityConfig.js file
 * @param {Object} resourceTemplate to validate
 * @return {Array<string} reasons that validation failed if invalid
 */
const validateTypeAheadAuthorityURIs = (resourceTemplate) => {
  const propertyTemplateIds = []
  const notFoundURIs = []
  resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
    const vocabUriList = propertyTemplate?.valueConstraint?.useValuesFrom
    const lookupConfigs = _.isEmpty(vocabUriList) ? [] : vocabUriList
    lookupConfigs.forEach((uri) => {
      const authority = findAuthorityConfig(uri)
      if (!authority) {
        propertyTemplateIds.push(propertyTemplate.propertyURI)
        notFoundURIs.push(uri)
      }
    })
  })
  if (propertyTemplateIds.length > 0) {
    return [
      formatError(
        `Property templates ${propertyTemplateIds.join(', ')} have value constraint lookup URIs that are not found in configuration: ${notFoundURIs.join(', ')}`,
        resourceTemplate,
      ),
    ]
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
    return [formatError(`The following property templates have unknown types or lookups: ${propertyTemplateIds.join(', ')}`, resourceTemplate)]
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
      if (!found && !_.isEmpty(resourceTemplateIdRef)) { // ignore blank referenced templates elements
        missingResourceTemplateIds.add(resourceTemplateIdRef)
      }
    }))
  }))
  if (missingResourceTemplateIds.size > 0) {
    // eslint-disable-next-line max-len
    return [formatError(`The following referenced resource templates are not available in Sinopia: ${Array.from(missingResourceTemplateIds).join(', ')}`, resourceTemplate)]
  }
  return []
}

/**
 * Validates that all value template refs have unique resource URIs.
 * @param {Object} resourceTemplate to validate
 * @return {Promise<Array<string>>} reasons that validation failed if invalid
 */
const validateUniqueResourceURIs = async (resourceTemplate) => {
  const errors = []
  await Promise.all(resourceTemplate.propertyTemplates.map(async (propertyTemplate) => {
    const refs = propertyTemplate.valueConstraint?.valueTemplateRefs || []
    const resourceURIs = {}
    // filter out blank referenced templates elements
    await Promise.all(refs.filter(resourceTemplateIdRef => !_.isEmpty(resourceTemplateIdRef)).map(async (resourceTemplateIdRef) => {
      const resourceTemplateRef = await fetchResourceTemplate(resourceTemplateIdRef)
      if (resourceTemplateRef) {
        const resourceURI = resourceTemplateRef.resourceURI
        if (!resourceURIs[resourceURI]) resourceURIs[resourceURI] = []
        resourceURIs[resourceURI].push(resourceTemplateIdRef)
      }
    }))
    const multipleResourceURIs = Object.keys(resourceURIs).filter(resourceURI => resourceURIs[resourceURI].length > 1)
    multipleResourceURIs.forEach((resourceURI) => {
      // eslint-disable-next-line max-len
      errors.push(formatError(`The following resource templates references for ${propertyTemplate.propertyURI} have the same resource URI (${resourceURI}), but must be unique: ${resourceURIs[resourceURI].join(', ')}`, resourceTemplate))
    })
  }))
  return errors
}

// Not using actionCreator/fetchResourceTemplate because want to avoid affecting state.
const fetchResourceTemplate = async resourceTemplateId => getResourceTemplate(resourceTemplateId, 'ld4p')
  .then(response => response.response.body)
  .catch((err) => {
    console.error(err.toString())
    return null
  })

const formatError = (error, resourceTemplate) => `Validation error for ${resourceTemplate.resourceURI}: ${error}`


export default validateResourceTemplate
