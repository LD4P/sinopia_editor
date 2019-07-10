// Copyright 2018, 2019 Stanford University see LICENSE for license

import lookupConfig from '../static/lookupConfig.json'
import N3Parser from 'n3/lib/N3Parser'

import rdf from 'rdf-ext'
import _ from 'lodash'

export const isResourceWithValueTemplateRef = property => property?.type === 'resource'
    && property?.valueConstraint?.valueTemplateRefs?.length > 0

export const resourceToName = (uri) => {
  if (!_.isString(uri)) return undefined

  return uri.substr(uri.lastIndexOf('/') + 1)
}

export const defaultValuesFromPropertyTemplate = (propertyTemplate) => {
  // Use safe navigation to deal with differently shaped property templates
  const defaultValue = propertyTemplate?.valueConstraint?.defaults?.[0]

  // Use the default URI for the literal value if the literal is undefined
  const defaultLiteral = defaultValue?.defaultLiteral

  const defaultURI = defaultValue?.defaultURI

  const defaultLabel = defaultLiteral || defaultURI

  if (!defaultValue || !defaultLabel) return []
  console.log('defaultURI', defaultURI)

  if (propertyTemplate.type !== 'literal') {
    return [{
      id: defaultValue.defaultURI,
      label: defaultLabel,
      uri: defaultValue.defaultURI,
    }]
  }
  return [{
    id: defaultValue.defaultURI,
    content: defaultLabel,
    lang: {items:[{id: 'en', label: 'English'}]}
  }]
}

export const booleanPropertyFromTemplate = (template, key, defaultValue) => {
  // Use safe navigation for dynamic properties: https://github.com/tc39/proposal-optional-chaining#syntax
  const propertyValue = template?.[key]

  if (!propertyValue) return defaultValue

  const parsedValue = JSON.parse(propertyValue)

  if (parsedValue !== true && parsedValue !== false) return defaultValue

  return parsedValue
}

export const defaultLangTemplate = () => ({
  items: [
    {
      id: 'en',
      label: 'English',
    },
  ],
})

export const getLookupConfigItems = (propertyTemplate) => {
  const vocabUriList = propertyTemplate?.valueConstraint?.useValuesFrom

  if (vocabUriList === undefined || vocabUriList.length === 0) return []

  const templateConfigItems = lookupConfig.filter(configItem => vocabUriList.includes(configItem.uri))

  return templateConfigItems
}

/**
 * Loads N3 into a dataset.
 * @param {string} data that is the N3
 * @return {Promise<rdf.Dataset>} a promise that resolves to the loaded dataset
 */
export const rdfDatasetFromN3 = data => new Promise((resolve) => {
  const parser = new N3Parser()
  const dataset = rdf.dataset()
  parser.parse(data,
    (error, quad) => {
      // the final time through this loop will be EOF and quad will be undefined
      if (quad) {
        dataset.add(quad)
      } else {
        // done parsing
        resolve(dataset)
      }
    })
})
