// Copyright 2018, 2019 Stanford University see LICENSE for license

import N3Parser from 'n3/lib/N3Parser'
import rdf from 'rdf-ext'
import _ from 'lodash'
import Config from 'Config'
import CryptoJS from 'crypto-js'
import SerializerJsonld from '@rdfjs/serializer-jsonld'
const concatStream = require('concat-stream')
const Readable = require('stream').Readable
const ParserJsonld = require('@rdfjs/parser-jsonld')

export const defaultLanguageId = 'eng'

export const isResourceWithValueTemplateRef = (property) => property?.type === 'resource'
    && property?.valueConstraint?.valueTemplateRefs?.length > 0

export const groupName = (uri) => {
  const groupSlug = uri.split('/')[4]
  return groupNameFromGroup(groupSlug)
}

export const groupNameFromGroup = (group) => Config.groupsInSinopia[group] || 'Unknown'

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
export const rdfDatasetFromN3 = (data) => new Promise((resolve, reject) => {
  const parser = new N3Parser({ factory: rdf })
  const dataset = rdf.dataset()
  parser.parse(data,
    (err, quad) => {
      if (err) {
        reject(err)
      }
      // the final time through this loop will be EOF and quad will be undefined
      if (quad) {
        dataset.add(quad)
      } else {
        // done parsing
        resolve(dataset)
      }
    })
})

export const jsonldFromDataset = (dataset) => {
  const SerializerJsonld = require('@rdfjs/serializer-jsonld')

  const serializerJsonld = new SerializerJsonld()

  const output = serializerJsonld.import(dataset.toStream())

  return new Promise((resolve, reject) => {
    output.pipe(concatStream(content => resolve(content)))

    output.on('error', err => reject(err))
  })

}

export const datasetFromJsonld = (jsonld) => {
  const parserJsonld = new ParserJsonld()

  const input = new Readable({
    read: () => {
      input.push(JSON.stringify(jsonld))
      input.push(null)
    }
  })

  const output = parserJsonld.import(input)
  const dataset = rdf.dataset()

  output.on('data', quad => {
    dataset.add(quad)
  })

  return new Promise((resolve, reject) => {
    output.on('end', resolve)
    output.on('error', reject)
  })
    .then(() => {
      return dataset
    })
}

export const generateMD5 = (message) => CryptoJS.MD5(message).toString()

export const findRootResourceTemplateId = (resourceURI, dataset) => {
  const rtQuads = dataset.match(rdf.namedNode(resourceURI), rdf.namedNode('http://sinopia.io/vocabulary/hasResourceTemplate')).toArray()
  if (rtQuads.length !== 1) {
    return null
  }
  return rtQuads[0].object.value
}

export const hasQuadsForRootResourceTemplateId = (resourceURI, dataset) => {
  const rtQuads = dataset.match(rdf.namedNode(resourceURI)).toArray()
  return rtQuads.length > 0
}
