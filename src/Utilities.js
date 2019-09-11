// Copyright 2018, 2019 Stanford University see LICENSE for license

import N3Parser from 'n3/lib/N3Parser'

import rdf from 'rdf-ext'
import _ from 'lodash'
import CryptoJS from 'crypto-js'
import * as jsonld from 'jsonld'

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

// export const rdfDatasetFromJsonLD = data => new Promise((resolve) => {
//   const jsonData = JSON.parse(data)
//   jsonld.toRDF(jsonData, {format: 'application/n-quads'}, (err, nquads) => {
//     // nquads is a string of N-Quads
//     console.log(nquads)
//   })
// })

export const rdfDatasetFromJsonLD = async (data) => {
  const jsonData = JSON.parse(data)
  const nquads = await jsonld.toRDF(jsonData, {format: 'application/n-quads'})
  console.log(nquads)
  return rdfDatasetFromN3(nquads)
}


export const generateMD5 = message => CryptoJS.MD5(message).toString()
