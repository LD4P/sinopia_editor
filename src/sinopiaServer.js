// Copyright 2019 Stanford University see LICENSE for license

import SinopiaServer from 'sinopia_server'
import CognitoUtils from './CognitoUtils'
import Config from './Config'
import {
  rtFixturesGroups, getFixtureResourceTemplate,
  listFixtureResourcesInGroupContainer, resourceTemplateIds,
} from '../__tests__/fixtureLoaderHelper'

const instance = new SinopiaServer.LDPApi()

instance.apiClient.basePath = Config.sinopiaServerBase

const emptyTemplate = { propertyTemplates: [{}] }

const getResourceTemplateFromServer = (templateId, group) => {
  // Allow function to be called without second arg
  if (!group) group = Config.defaultSinopiaGroupId

  if (!templateId) {
    emptyTemplate.error = 'ERROR: asked for resourceTemplate with null/undefined id'

    return emptyTemplate
  }

  return instance.getResourceWithHttpInfo(group, templateId, { accept: 'application/json' })
}

const foundResourceTemplateFromServer = (templateId, group) => {
  // Allow function to be called without second arg
  if (!group) group = Config.defaultSinopiaGroupId

  return instance.headResourceWithHttpInfo(group, templateId, { accept: 'application/json' })
    .then(() => true)
    .catch(() => false)
}

export const foundResourceTemplate = (templateId, group) => {
  if (Config.useResourceTemplateFixtures) return resourceTemplateIds.includes(templateId)

  return foundResourceTemplateFromServer(templateId, group)
}

export const getResourceTemplate = (templateId, group) => {
  if (Config.useResourceTemplateFixtures) return getFixtureResourceTemplate(templateId)

  return getResourceTemplateFromServer(templateId, group)
}

export const getGroups = () => {
  if (Config.useResourceTemplateFixtures) return rtFixturesGroups()

  return instance.getBaseWithHttpInfo()
}

export const listResourcesInGroupContainer = (group) => {
  if (Config.useResourceTemplateFixtures) return listFixtureResourcesInGroupContainer(group)

  return instance.getGroupWithHttpInfo(group)
}

export const getEntityTagFromGroupContainer = async (group) => {
  const result = await instance.headGroupWithHttpInfo(group)


  return result.response.header.etag
}

const authenticate = async (currentUser) => {
  // First, make sure the client instance has a valid JWT id token set
  await CognitoUtils.getIdTokenString(currentUser)
    .then(idToken => instance.apiClient.authentications.CognitoUser.accessToken = idToken)

  /*
   * TODO: add auth-related error handling similar to the catch on the createResourceWithHttpInfo try below, e.g.
   * * display a warning that the operation failed due to error with current session
   *   * add action and reducer for session expired, have LoginPanel display specific err msg.  reducer should clear session (and
   *     user as needed) so the login panel goes back to the not logged in state.  highlight LoginPanel or something too (along w/ the err msg).
   *   * user logs in via login panel again.  app state now has a valid cognito user with a valid session.
   *   * user tries to do this action again, now that they have a valid sesison, hopefully succeeds.
   * This will be done as part of https://github.com/LD4P/sinopia_editor/issues/528
   */
}

export const createResourceTemplate = async (templateObject, group, currentUser) => {
  // If the authentication function throws, let the caller of this function catch it
  await authenticate(currentUser)

  return await instance.createResourceWithHttpInfo(group, templateObject, { slug: templateObject.id, contentType: 'application/json' })
}

export const updateResourceTemplate = async (templateObject, group, currentUser) => {
  // If the authentication function throws, let the caller of this function catch it
  await authenticate(currentUser)

  return await instance.updateResourceWithHttpInfo(group, templateObject.id, templateObject, { contentType: 'application/json' })
}

const sendingNtriples = { contentType: 'application/n-triples' }
const returningNtriples = { accept: 'application/n-triples' }

/**
 * @return {Promise} when the promise resolves it returns an object with `data` and response
 *                   response looks like this:
 *                   {
 *                     "data": null,
 *                     "response": {
 *                       "req": {
 *                         "_query": [],
 *                         "method": "POST",
 *                         "url": "http://localhost:8080/repository/ld4p",
 *                         "header": {
 *                           "Authorization": "Bearer [token]",
 *                           "Content-Type": "application/n-triples",
 *                           "Accept": "application/ld+json"
 *                         },
 *                         "_header": {
 *                           "authorization": "Bearer [token]",
 *                           "content-type": "application/n-triples",
 *                           "accept": "application/ld+json"
 *                         },
 *                         "_callbacks": {
 *                           "$end": [
 *                             null
 *                           ]
 *                         },
 *                         "_timeout": 60000,
 *                         "_responseTimeout": 0,
 *                         "_data": "<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Work> .\n<> <http://id.loc.gov/ontologies/bibframe/copyrightDate> \"mydefaultvalue\" .\n<> <http://id.loc.gov/ontologies/bibframe/creationDate> \"mydefaultvalue\" .\n<> <http://id.loc.gov/ontologies/bibframe/duration> \"mydefaultvalue\" .\n<> <http://id.loc.gov/ontologies/bibframe/equinox> \"mydefaultvalue\" .\n<> <http://id.loc.gov/ontologies/bibframe/subject> <http://id.loc.gov/authorities/subjects/sh85027699> .\n<> <http://id.loc.gov/ontologies/bibframe/polarity> <http://id.loc.gov/authorities/subjects/sh85027699> .\n<> <http://id.loc.gov/ontologies/bibframe/grantingInstitution> <http://id.loc.gov/authorities/names/no2015043111> .\n<> <http://id.loc.gov/ontologies/bibframe/illustrativeContent> <http://id.loc.gov/vocabulary/millus/fac> .\n",
 *                         "_endCalled": true,
 *                         "xhr": {}
 *                       },
 *                       "xhr": {},
 *                       "text": "",
 *                       "statusText": "Created",
 *                       "statusCode": 201,
 *                       "status": 201,
 *                       "statusType": 2,
 *                       "info": false,
 *                       "ok": true,
 *                       "redirect": false,
 *                       "clientError": false,
 *                       "serverError": false,
 *                       "error": false,
 *                       "created": true,
 *                       "accepted": false,
 *                       "noContent": false,
 *                       "badRequest": false,
 *                       "unauthorized": false,
 *                       "notAcceptable": false,
 *                       "forbidden": false,
 *                       "notFound": false,
 *                       "unprocessableEntity": false,
 *                       "headers": {
 *                         "link": "<http://www.w3.org/ns/ldp#RDFSource>; rel=\"type\", <http://www.w3.org/ns/ldp#Resource>; rel=\"type\", <http://platform:8080/repository/ld4p?ext=acl>; rel=\"acl\"",
 *                         "location": "http://platform:8080/repository/ld4p/845325c8-db9f-4eed-a5d1-f3e8cdd003b7",
 *                         "content-type": null
 *                       },
 *                       "header": {
 *                         "link": "<http://www.w3.org/ns/ldp#RDFSource>; rel=\"type\", <http://www.w3.org/ns/ldp#Resource>; rel=\"type\", <http://platform:8080/repository/ld4p?ext=acl>; rel=\"acl\"",
 *                         "location": "http://platform:8080/repository/ld4p/845325c8-db9f-4eed-a5d1-f3e8cdd003b7",
 *                         "content-type": null
 *                       },
 *                       "type": "",
 *                       "links": {
 *                         "type": "http://www.w3.org/ns/ldp#Resource",
 *                         "acl": "http://platform:8080/repository/ld4p?ext=acl"
 *                       },
 *                       "body": null
 *                     }
 *                   }
 */
export const publishRDFResource = async (currentUser, rdf, group) => {
  await authenticate(currentUser)
  return await instance.createResourceWithHttpInfo(group, rdf, sendingNtriples)
}

/* eslint security/detect-unsafe-regex: ["off"] */
/**
 * The swagger API want's to deal with parameters (groupID and resourceID), but
 * we only have a URI, so parse those out.
 * @return {object} and object with two keys: 'group' and 'identifier'
 */
const identifiersForUri = uri => uri.match(/.*\/\/.*\/repository\/(?<group>.*)\/(?<identifier>.*)/).groups

export const updateRDFResource = async (currentUser, uri, rdf) => {
  await authenticate(currentUser)

  const id = identifiersForUri(uri)
  return await instance.updateResource(id.group, id.identifier, rdf, sendingNtriples)
}

export const loadRDFResource = async (currentUser, uri) => {
  await authenticate(currentUser)

  const id = identifiersForUri(uri)
  return await instance.getResourceWithHttpInfo(id.group, id.identifier, returningNtriples)
}

export const getSearchResults = async (query, queryFrom = 0) => {
  const uri = `${Config.searchHost}${Config.searchPath}?q=title:${query}%20OR%20subtitle:${query}&from=${queryFrom}&size=${Config.searchResultsPerPage}`

  // Could be using row._source.uri for uri, but this approach handles platform/localhost for local env.
  return fetch(uri)
    .then(resp => resp.json())
    .then(json => ({
      totalHits: json.hits.total,
      results: json.hits.hits.map(row => ({
        uri: row._id,
        title: row._source.label,
      })),
    }))
    .catch(err => ({
      totalHits: 0,
      results: [],
      error: err,
    }))
}
