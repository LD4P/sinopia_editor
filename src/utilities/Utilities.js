// Copyright 2018, 2019 Stanford University see LICENSE for license

import N3Parser from "n3/lib/N3Parser"
import rdf from "rdf-ext"
import _ from "lodash"
import CryptoJS from "crypto-js"
import { JsonLdParser } from "jsonld-streaming-parser"
import { Writer as N3Writer } from "n3"
import dateFormat from "date-and-time"

const concatStream = require("concat-stream")
const Readable = require("stream").Readable
const SerializerJsonld = require("@rdfjs/serializer-jsonld-ext")

export const isResourceWithValueTemplateRef = (property) =>
  property?.type === "resource" &&
  property?.valueConstraint?.valueTemplateRefs?.length > 0

export const resourceToName = (uri) => {
  if (!_.isString(uri)) return undefined

  const index = uri.lastIndexOf("/")

  if (index === -1) return uri

  return uri.substr(index + 1)
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

export const isHttp = (uri) =>
  _.startsWith(uri, "http://") || _.startsWith(uri, "https://")

/**
 * Loads N3 into a dataset.
 * @param {string} data that is the N3
 * @return {Promise<rdf.Dataset>} a promise that resolves to the loaded dataset
 */
export const datasetFromN3 = (data) =>
  new Promise((resolve, reject) => {
    const parser = new N3Parser({ factory: rdf })
    const dataset = rdf.dataset()
    parser.parse(data, (err, quad) => {
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

export const n3FromDataset = (dataset, format) =>
  new Promise((resolve, reject) => {
    const writer = new N3Writer({
      format: format === "n-triples" ? "N-Triples" : undefined,
    })
    writer.addQuads(dataset.toArray())
    writer.end((error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export const jsonldFromDataset = (dataset) => {
  const serializerJsonld = new SerializerJsonld({ expand: true })

  const output = serializerJsonld.import(dataset.toStream())

  return new Promise((resolve, reject) => {
    output.pipe(concatStream((content) => resolve(content)))

    output.on("error", (err) => reject(err))
  })
}

export const datasetFromJsonld = (jsonld) => {
  const parserJsonld = new JsonLdParser()

  const input = new Readable({
    read: () => {
      input.push(JSON.stringify(jsonld))
      input.push(null)
    },
  })

  const output = parserJsonld.import(input)
  const dataset = rdf.dataset()

  output.on("data", (quad) => {
    dataset.add(quad)
  })

  return new Promise((resolve, reject) => {
    output.on("end", resolve)
    output.on("error", reject)
  }).then(() => dataset)
}

export const generateMD5 = (message) => CryptoJS.MD5(message).toString()

export const findRootResourceTemplateId = (resourceURI, dataset) => {
  const rtQuads = dataset
    .match(
      rdf.namedNode(resourceURI),
      rdf.namedNode("http://sinopia.io/vocabulary/hasResourceTemplate")
    )
    .toArray()
  if (rtQuads.length !== 1) {
    return null
  }
  return rtQuads[0].object.value
}

export const hasQuadsForRootResourceTemplateId = (resourceURI, dataset) => {
  const rtQuads = dataset.match(rdf.namedNode(resourceURI)).toArray()
  return rtQuads.length > 0
}

export const datasetFromRdf = (rdf) => {
  // Try parsing as JSON.
  let json
  try {
    json = JSON.parse(rdf)
  } catch {
    return datasetFromN3(rdf)
  }
  return datasetFromJsonld(json)
}

export const emptyValue = (value) =>
  !value.literal && !value.uri && !value.valueSubjectKey

export const isInViewport = (elem) => {
  // Adapted from https://gomakethings.com/how-to-test-if-an-element-is-in-the-viewport-with-vanilla-javascript/
  if (!elem) return false
  const bounding = elem.getBoundingClientRect()
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
  )
}

export const isTopInViewport = (elem) => {
  // Adapted from https://gomakethings.com/how-to-test-if-an-element-is-in-the-viewport-with-vanilla-javascript/
  if (!elem) return false
  const bounding = elem.getBoundingClientRect()
  return (
    bounding.top >= 0 &&
    bounding.top <=
      (window.innerHeight || document.documentElement.clientHeight)
  )
}

export const stickyScrollIntoView = (
  targetSelector,
  headerSelector = "#sticky-resource-header"
) => {
  const elem = document.querySelector(targetSelector)
  if (isTopInViewport(elem)) return
  const stickyHeader = document.querySelector(headerSelector)
  // do not scroll to top, leave space for sticky header
  const y =
    elem.getBoundingClientRect().top +
    window.pageYOffset -
    stickyHeader.clientHeight
  window.scrollTo({ top: y, behavior: "smooth" })
}

// This is UTC.
export const formatISODate = (date) => date.toISOString().slice(0, 10)

// This is local timezone.
export const formatLocalDate = (date) => dateFormat.format(date, "YYYY-MM-DD")
