// Copyright 2019 Stanford University see LICENSE for license
import Config from "Config"
import { findAuthorityConfig } from "utilities/authorityConfig"
import _ from "lodash"

export const isContext = (propertyTemplate) =>
  propertyTemplate?.subtype === "context"

const baseUrlFromConfig = (nonldLookup, authority, subauthority) => {
  /*
   * There are four types of lookup: linked data and non-linked data, authority
   * and subauthority. The API calls for each type are different, so construct
   * the URL depending on the options passed.
   */
  const urlSegments = [Config.qaUrl, "authorities", "search"]

  if (!nonldLookup) urlSegments.push("linked_data")

  urlSegments.push(authority)

  if (subauthority) urlSegments.push(subauthority)

  return urlSegments.join("/")
}

export const createLookupPromise = (
  query,
  { authority, subauthority, language, nonldLookup },
  options = {}
) => {
  const baseUrl = baseUrlFromConfig(nonldLookup, authority, subauthority)
  const urlParams = new URLSearchParams({
    q: query,
    maxRecords: options.resultsPerPage || Config.maxRecordsForQALookups,
    lang: language || "en",
    context: true, // Always search to see if context is available
    response_header: true,
    startRecord: options.startOfRange ? options.startOfRange + 1 : 1,
  })

  /*
   * Return the promise
   * Since we don't want promise.all to fail if
   * one of the lookups fails, we want a catch statement
   * at this level which will then return the error. Subauthorities require a different API call than authorities so need to check if subauthority is available
   */
  return fetch(`${baseUrl}?${urlParams}`)
    .then((resp) => {
      if (!resp.ok)
        throw new Error(
          `Questioning Authority service returned ${resp.statusText}`
        )
      return resp
    })
    .then((resp) => resp.json())
    .then((json) => {
      // This adapts authorities that don't return headers.
      if (json.response_header) return json

      return {
        response_header: {
          total_records: json.length,
        },
        results: json,
      }
    })
    .catch((err) => {
      console.error(
        `Error in Questioning Authority lookup: ${err.message || err}`
      )
      // Return information along with the error in its own object
      return { isError: true, errorObject: err }
    })
}

/**
 * Fetches a term (aka resource) from QA.
 * @param {string} uri of the resource
 * @param {string} searchUri uri of the endpoint from which to fetch
 * @param {string} format supported by QA
 * @return {Promise<string>} the term as text
 */
export const getTerm = (uri, id, searchUri, format = "n3") => {
  const authorityConfig = findAuthorityConfig(searchUri)
  const authority = authorityConfig.authority

  let url
  if (authorityConfig.nonldLookup) {
    let path = authority.toLowerCase()
    if (!_.isEmpty(authorityConfig.subauthority)) {
      path += `/${authorityConfig.subauthority}`
    }
    url = `${Config.qaUrl}/authorities/show/${path}/${id}?format=${format}`
  } else {
    url = `${
      Config.qaUrl
    }/authorities/fetch/linked_data/${authority.toLowerCase()}?format=${format}&uri=${uri}`
  }

  return fetch(url).then((resp) => resp.text())
}

/**
 * Finds property values in QA contexts.
 * @param {Array} QA contexts
 * @param {string} name of property
 * @return {string[]} property values or undefined
 */
export const getContextValues = (contexts, property) => {
  const context = contexts.find((context) => context.property === property)
  if (!context || !context.values) return undefined
  return context.values
}

/**
 * Finds first property value in QA contexts.
 * @param {Array} QA contexts
 * @param {string} name of property
 * @return {string} first property value or undefined
 */
export const getContextValue = (contexts, property) => {
  const values = getContextValues(contexts, property)
  if (_.isEmpty(values)) return undefined
  return values[0]
}
