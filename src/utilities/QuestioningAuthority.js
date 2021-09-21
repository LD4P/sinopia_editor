// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 4] */

import Swagger from "swagger-client"
import swaggerSpec from "lib/apidoc.json"
import Config from "Config"
import { findAuthorityConfig } from "utilities/authorityConfig"
import _ from "lodash"

export const isContext = (propertyTemplate) =>
  propertyTemplate?.subtype === "context"

export const createLookupPromise = (query, lookupConfig, options = {}) => {
  const authority = lookupConfig.authority
  const subauthority = lookupConfig.subauthority
  const language = lookupConfig.language

  /*
   *  There are two types of lookup: linked data and non-linked data. The API calls
   *  for each type are different, so check the nonldLookup field in the lookup config.
   *  If the field is not set, assume false.
   */

  // default the API calls to their linked data values
  let subAuthCall = "GET_searchSubauthority"
  let authorityCall = "GET_searchAuthority"

  // Change the API calls if this is a non-linked data lookup
  if (lookupConfig.nonldLookup) {
    subAuthCall = "GET_nonldSearchWithSubauthority"
    authorityCall = "GET_nonldSearchAuthority"
  }

  /*
   * Return the promise
   * Since we don't want promise.all to fail if
   * one of the lookups fails, we want a catch statement
   * at this level which will then return the error. Subauthorities require a different API call than authorities so need to check if subauthority is available
   * The only difference between this call and the next one is the call to Get_searchSubauthority instead of
   * Get_searchauthority.  Passing API call in a variable name/dynamically, thanks @mjgiarlo
   */
  const actionFunction = subauthority ? subAuthCall : authorityCall

  return Swagger({ spec: swaggerSpec }).then((client) =>
    client.apis.SearchQuery?.[actionFunction]({
      q: query,
      vocab: authority,
      subauthority,
      maxRecords: options.resultsPerPage || Config.maxRecordsForQALookups,
      lang: language,
      context: true, // Always search to see if context is available
      response_header: true,
      startRecord: options.startOfRange ? options.startOfRange + 1 : 1,
    }).catch((err) => {
      console.error("Error in executing lookup against source", err.toString())
      // Return information along with the error in its own object
      return { isError: true, errorObject: err }
    })
  )
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
