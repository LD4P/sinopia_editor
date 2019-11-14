// Copyright 2018, 2019 Stanford University see LICENSE for license
import GraphBuilder from 'GraphBuilder'
import { generateMD5 } from 'Utilities'

export const currentResourceKey = state => state.selectorReducer.editor.currentResource

/**
 * Find a resource.
 * @param {Object} state the redux state
 * @param {string} resourceKey of the resource to check; if omitted, current resource key is used
 * @return {Object} the resource or undefined
 */
export const findResource = (state, resourceKey) => state.selectorReducer.entities.resources[resourceKey || currentResourceKey(state)]

/**
 * Finds the resource URI for a resource.
 * @param {Object} state the redux state
 * @param {string} resourceKey of the resource to check; if omitted, current resource key is used
 * @return {Object} the resource URI or undefined
 */
export const findResourceURI = (state, resourceKey) => {
  const resource = findResource(state, resourceKey)
  if (!resource) return undefined
  return Object.values(resource)[0]?.resourceURI
}

/**
 * Finds the root resource template id.
 * @param {Object} state the redux state
 * @param {string} resourceKey of the resource to check; if omitted, current resource key is used
 * @return {Object} the resource template id or undefined
 */
export const rootResourceTemplateId = (state, resourceKey) => {
  const resource = findResource(state, resourceKey)
  if (!resource) return undefined
  return Object.keys(resource)[0]
}

/**
 * Determines if there is a resource (using current resource).
 * @param {Object} state the redux state
 * @return {boolean} true if there is a resource
 */
export const hasResource = state => findResource(state) !== undefined

export const findNode = (state, reduxPath) => findObjectAtPath(state.selectorReducer, reduxPath)

export const findObjectAtPath = (parent, path) => path.reduce((obj, key) => obj?.[key], parent) || {}

export const isExpanded = (state, reduxPath) => [...reduxPath, 'expanded']
  .reduce((obj, key) => (typeof obj[key] !== 'undefined' ? obj[key] : false), state.selectorReducer.editor.expanded)

const resourceValidation = state => state.selectorReducer.editor.resourceValidation

/**
 * @returns {function} a function that returns all of the validation errors for the redux path
 */
export const findResourceValidationErrorsByPath = (state, reduxPath) => findObjectAtPath(resourceValidation(state).errorsByPath, reduxPath).errors || []

/**
 * Returns the resource validation errors for a resource.
 * @param {Object} state the redux state
 * @param {string} resourceKey of the resource to check; if omitted, current resource key is used
 * @return {string[]} array of validation errors
 */
export const findResourceValidationErrors = (state, resourceKey) => resourceValidation(state).errors[resourceKey || currentResourceKey(state)] || []

/**
  * Determines if resource validation should be displayed.
  * @param {Object} state the redux state
  * @param {string} resourceKey of the resource to check; if omitted, current resource key is used
  * @return {boolean} true if resource validations should be displayed
  */
export const getDisplayResourceValidations = (state, resourceKey) => resourceValidation(state).show[resourceKey || currentResourceKey(state)] || false

/**
 * @returns {function} a function that returns the errors for an error key
 */
export const findErrors = (state, errorKey) => state.selectorReducer.editor.errors[errorKey] || []

/**
 * Get a list of selections that have been made for the given reduxPath
 * @param {Object} state the redux state
 * @param {string[]} reduxPath the path to the input field
 * @return {Object[]} the selected options
 */
export const itemsForProperty = (state, reduxPath) => {
  const result = findNode(state, reduxPath)
  return Object.values(result.items || {})
}

/**
 * @returns {function} a function that gets a resource template from state or undefined
 */
export const getResourceTemplate = (state, resourceTemplateId) => findNode(state, ['entities', 'resourceTemplates'])[resourceTemplateId]


/**
 * @returns {function} a function that gets a property template from state or undefined
 */
export const getPropertyTemplate = (state, resourceTemplateId, propertyURI) => {
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)

  if (!resourceTemplate) {
    return
  }

  // Find the property template
  return resourceTemplate.propertyTemplates.find(propertyTemplate => propertyTemplate.propertyURI === propertyURI)
}

/**
 * Determines if a resource has been changed since it was last saved.
 * @param {Object} state the redux state
 * @param {string} resourceKey of the resource to check; if omitted, current resource key is used
 * @return {true} true if the resource has changed
 */
export const resourceHasChangesSinceLastSave = (state, resourceKey) => {
  const thisResourceKey = resourceKey || currentResourceKey(state)
  const lastSaveChecksum = state.selectorReducer?.editor?.lastSaveChecksum[thisResourceKey]
  if (lastSaveChecksum === undefined) {
    return true
  }
  const rdf = new GraphBuilder(state.selectorReducer.entities.resources[thisResourceKey], state.selectorReducer.entities.resourceTemplates).graph.toCanonical()
  const resourceChecksum = generateMD5(rdf)
  return lastSaveChecksum !== resourceChecksum
}
