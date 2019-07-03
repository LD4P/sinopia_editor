// Copyright 2019 Stanford University see LICENSE for license

/**
 * Validates a resource template.
 * Validation checks that does not contain repeated property templates.
 * @param {Object>} resourceTemplate to validate
 * @return {string|null} reasons that validation failed if invalid otherwise null if valid
 */
const validateResourceTemplate = (resourceTemplate) => {
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
    return `Repeated property templates with same property URI (${dupes}) are not allowed.`
  }
  return null
}

export default validateResourceTemplate
