// Copyright 2018, 2019 Stanford University see LICENSE for license
import GraphBuilder from 'GraphBuilder'
import { generateMD5 } from 'Utilities'

export const rootResource = state => Object.values(state.selectorReducer.resource)[0]

export const rootResourceTemplateId = state => Object.keys(state.selectorReducer.resource)[0]

export const rootResourceId = state => rootResource(state)?.resourceURI

export const findNode = (state, reduxPath) => findObjectAtPath(state.selectorReducer, reduxPath)

export const findObjectAtPath = (parent, path) => path.reduce((obj, key) => obj?.[key], parent) || {}

export const isExpanded = (state, reduxPath) => [...reduxPath, 'expanded']
  .reduce((obj, key) => (typeof obj[key] !== 'undefined' ? obj[key] : false), state.selectorReducer.editor.expanded)

const findResourceValidation = state => state.selectorReducer.editor.resourceValidation

/**
 * @returns {function} a function that returns all of the validation errors for the redux path
 */
export const findResourceValidationErrorsByPath = (state, reduxPath) => findObjectAtPath(findResourceValidation(state).errorsByPath, reduxPath).errors || []

/**
 * @returns {function} a function that returns all of the validation errors for the resource
 */
export const findResourceValidationErrors = state => findResourceValidation(state).errors

/**
 * @returns {function} a function that returns true if validations should be displayed
 */
export const getDisplayResourceValidations = state => findResourceValidation(state).show

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

export const resourceHasChangesSinceLastSave = (state) => {
  const lastSaveChecksum = state.selectorReducer?.editor?.lastSaveChecksum
  if (lastSaveChecksum === undefined) {
    return true
  }
  const rdf = new GraphBuilder(state.selectorReducer).graph.toCanonical()
  const resourceChecksum = generateMD5(rdf)
  return lastSaveChecksum !== resourceChecksum
}
