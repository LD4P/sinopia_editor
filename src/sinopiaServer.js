// Copyright 2018 Stanford University see LICENSE for license

import SinopiaServer from 'sinopia_server'
import CognitoUtils from './CognitoUtils'
import Config from './Config'
import { spoofedGetGroups, spoofedGetResourceTemplate, spoofedListResourcesInGroupContainer } from './sinopiaServerSpoof'

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

export const resourceTemplateExists = async (templateId, group = Config.defaultSinopiaGroupId) => {
  try {
    const result = await instance.headResourceWithHttpInfo(group, templateId)

    return result.response.ok
  } catch (error) {
    console.error(`error checking if ${templateId} exists: ${error}; returning true to be safe`)
    return false
  }
}

export const getResourceTemplate = (templateId, group) => {
  if (Config.spoofSinopiaServer) return spoofedGetResourceTemplate(templateId)

  return getResourceTemplateFromServer(templateId, group)
}

export const getGroups = () => {
  if (Config.spoofSinopiaServer) return spoofedGetGroups()

  return instance.getBaseWithHttpInfo()
}

export const listResourcesInGroupContainer = (group) => {
  if (Config.spoofSinopiaServer) return spoofedListResourcesInGroupContainer(group)

  return instance.getGroupWithHttpInfo(group)
}

export const getEntityTagFromGroupContainer = async (group) => {
  const result = await instance.headGroupWithHttpInfo(group)

  return result.response.header.etag
}

const authenticate = async (currentUser) => {
  // first, make sure the client instance has a valid JWT id token set
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
