// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 4] */

import { loadingQaResults, qaResultsReceived } from 'actions/index'
import Swagger from 'swagger-client'
import swaggerSpec from 'lib/apidoc.json'
import { getLookupConfigItems } from 'utilities/propertyTemplates'
import Config from 'Config'

const search = (query, propertyTemplate) => (dispatch) => {
  dispatch(loadingQaResults())

  return getSearchResults(query, propertyTemplate).then((values) => {
    dispatch(qaResultsReceived(values))
  })
}

export const getSearchResults = (query, propertyTemplate) => Swagger({ spec: swaggerSpec })
  .then((client) => {
    const lookupConfigs = getLookupConfigItems(propertyTemplate)

    // Create array of promises based on the lookup config array that is sent in
    const lookupPromises = createLookupPromises(client, query, lookupConfigs, isContext(propertyTemplate))

    /*
     * If undefined, add info - note if error, error object returned in object
     * which allows attaching label and uri for authority
     */
    return Promise.all(lookupPromises).then((values) => {
      for (let i = 0; i < values.length; i++) {
        if (values[i]) {
          values[i].authLabel = lookupConfigs[i].label
          values[i].authURI = lookupConfigs[i].uri
          values[i].label = lookupConfigs[i].label
          values[i].id = lookupConfigs[i].uri
        }
      }

      return values
    })
  }).catch((e) => {
    console.error(e)
  })

export const isContext = propertyTemplate => propertyTemplate?.subtype === 'context'

const createLookupPromises = (client, query, lookupConfigs, context) => lookupConfigs.map((lookupConfig) => {
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

  return client
    .apis
    .SearchQuery?.[actionFunction]({
      q: query,
      vocab: authority,
      subauthority,
      maxRecords: Config.maxRecordsForQALookups,
      lang: language,
      context,
    })
    .catch((err) => {
      console.error('Error in executing lookup against source', err)
      // Return information along with the error in its own object
      return { isError: true, errorObject: err }
    })
})

export default search
