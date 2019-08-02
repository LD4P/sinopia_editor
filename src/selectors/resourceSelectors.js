// Copyright 2018, 2019 Stanford University see LICENSE for license
import GraphBuilder from 'GraphBuilder'
import { generateMD5 } from 'Utilities'

export const rootResource = state => Object.values(state.selectorReducer.resource)[0]

export const rootResourceId = state => rootResource(state)?.resourceURI

export const findNode = (selectorReducer, reduxPath) => {
  const items = reduxPath.reduce((obj, key) => obj?.[key], selectorReducer)

  return items || {}
}

export const isExpanded = (selectorReducer, reduxPath) => ['editor', 'expanded', ...reduxPath, 'expanded']
  .reduce((obj, key) => (typeof obj[key] !== 'undefined' ? obj[key] : false), selectorReducer)

export const findErrors = (selectorReducer, reduxPath) => {
  const errors = ['editor', 'resourceValidationErrors', ...reduxPath, 'errors'].reduce((obj, key) => obj?.[key], selectorReducer)

  return errors || []
}

/**
 * Get a list of selections that have been made for the given reduxPath
 * @param {Object} selectorReducer the redux state
 * @param {string[]} reduxPath the path to the input field
 * @return {Object[]} the selected options
 */
export const itemsForProperty = (selectorReducer, reduxPath) => {
  const result = findNode(selectorReducer, reduxPath)

  return Object.keys(result.items || {})
}

/**
 * @returns {function} a function that returns true if validations should be displayed
 */
export const getDisplayValidations = state => findNode(state.selectorReducer, ['editor']).displayValidations

/**
 * @returns {function} a function that gets a resource template from state or undefined
 */
export const getResourceTemplate = (state, resourceTemplateId) => findNode(state.selectorReducer, ['entities', 'resourceTemplates'])[resourceTemplateId]


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
