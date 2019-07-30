// Copyright 2018, 2019 Stanford University see LICENSE for license

import lookupConfig from '../static/lookupConfig.json'
import N3Parser from 'n3/lib/N3Parser'
import rdf from 'rdf-ext'
import _ from 'lodash'
import shortid from 'shortid'
import CryptoJS from 'crypto-js'

export const defaultLanguageId = 'en'

export const isResourceWithValueTemplateRef = property => property?.type === 'resource'
    && property?.valueConstraint?.valueTemplateRefs?.length > 0

export const resourceToName = (uri) => {
  if (!_.isString(uri)) return undefined

  return uri.substr(uri.lastIndexOf('/') + 1)
}

export const isValidURI = (value) => {
  try {
    /* eslint no-new: 'off' */
    new URL(value)
    return true
  } catch (e) {
    return false
  }
}

export const defaultValuesFromPropertyTemplate = (propertyTemplate) => {
  const defaults = propertyTemplate?.valueConstraint?.defaults || []
  const defaultValues = []
  defaults.forEach((defaultValue) => {
    // Use the default URI for the literal value if the literal is undefined
    const defaultLiteral = defaultValue?.defaultLiteral

    const defaultURI = defaultValue?.defaultURI

    const defaultLabel = defaultLiteral || defaultURI

    if (!defaultValue || !defaultLabel) return

    if (propertyTemplate.type !== 'literal') {
      defaultValues.push({
        id: shortid.generate(),
        label: defaultLabel,
        uri: defaultValue.defaultURI,
      })
    } else {
      defaultValues.push({
        id: shortid.generate(),
        content: defaultLabel,
        lang: defaultLanguageId,
      })
    }
  })
  return defaultValues
}

export const booleanPropertyFromTemplate = (template, key, defaultValue) => {
  // Use safe navigation for dynamic properties: https://github.com/tc39/proposal-optional-chaining#syntax
  const propertyValue = template?.[key]

  if (!propertyValue) return defaultValue

  const parsedValue = JSON.parse(propertyValue)

  if (parsedValue !== true && parsedValue !== false) return defaultValue

  return parsedValue
}


export const getLookupConfigItems = (propertyTemplate) => {
  const vocabUriList = propertyTemplate?.valueConstraint?.useValuesFrom

  if (vocabUriList === undefined || vocabUriList.length === 0) return []

  return lookupConfig.filter(configItem => vocabUriList.includes(configItem.uri))
}

/**
 * Loads N3 into a dataset.
 * @param {string} data that is the N3
 * @return {Promise<rdf.Dataset>} a promise that resolves to the loaded dataset
 */
export const rdfDatasetFromN3 = data => new Promise((resolve) => {
  const parser = new N3Parser({ factory: rdf })
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

export const generateMD5 = message => CryptoJS.MD5(message).toString()
