// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 4] */

import Swagger from 'swagger-client'
import swaggerSpec from 'lib/apidoc.json'
import { getLookupConfigItems } from 'utilities/propertyTemplates'
import Config from 'Config'

const getSearchResults = (query, propertyTemplate) => {
  const lookupConfigs = getLookupConfigItems(propertyTemplate)

  // Create array of Promises<results> based on the lookup config array that is sent in
  return createLookupPromises(query, lookupConfigs).map((lookupPromise, i) => lookupPromise.then((value) => {
    if (value) {
      value.authLabel = lookupConfigs[i].label
      value.authURI = lookupConfigs[i].uri
      value.label = lookupConfigs[i].label
      value.id = lookupConfigs[i].uri
    }
    return value
  }))
}

export const isContext = propertyTemplate => propertyTemplate?.subtype === 'context'

export const createLookupPromises = (query, lookupConfigs) => lookupConfigs.map((lookupConfig) => {
  const authority = lookupConfig.authority
  const subauthority = lookupConfig.subauthority
  const language = lookupConfig.language

  /*
   *  There are two types of lookup: linked data and non-linked data. The API calls
   *  for each type are different, so check the nonldLookup field in the lookup config.
   *  If the field is not set, assume false.
   */

  // default the API calls to their linked data values
  let subAuthCall = 'GET_searchSubauthority'
  let authorityCall = 'GET_searchAuthority'

  // Change the API calls if this is a non-linked data lookup
  if (lookupConfig.nonldLookup) {
    subAuthCall = 'GET_nonldSearchWithSubauthority'
    authorityCall = 'GET_nonldSearchAuthority'
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

  return Swagger({ spec: swaggerSpec }).then(client => client
    .apis
    .SearchQuery?.[actionFunction]({
      q: query,
      vocab: authority,
      subauthority,
      maxRecords: Config.maxRecordsForQALookups,
      lang: language,
      context: true, // Always search to see if context is available
    })
      .catch((err) => {
        console.error('Error in executing lookup against source', err.toString())
        // Return information along with the error in its own object
        return { isError: true, errorObject: err }
      }))
})

export default getSearchResults
