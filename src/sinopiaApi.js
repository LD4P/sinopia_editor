// Copyright 2019 Stanford University see LICENSE for license

import { datasetFromJsonld, jsonldFromDataset } from 'utilities/Utilities'
import Config from './Config'
/* eslint-disable node/no-unpublished-import */
import { hasFixtureResource, getFixtureResource } from '../__tests__/testUtilities/fixtureLoaderHelper'
import GraphBuilder from 'GraphBuilder'
import { v4 as uuidv4 } from 'uuid'
import Auth from '@aws-amplify/auth'

/**
 * Fetches a resource from the Sinopia API.
 * @return {Promise{[rdf.Dataset, Object]} resource as dataset, response JSON.
 * @throws when error occurs retrieving or parsing the resource template.
 */
export const fetchResource = (uri, isTemplate) => {
  let fetchPromise
  // Templates have special handling when using fixtures.
  // A template will raise when found; other resources will try API.
  if (Config.useResourceTemplateFixtures && hasFixtureResource(uri)) {
    try {
      fetchPromise = Promise.resolve(getFixtureResource(uri))
    } catch (err) {
      fetchPromise = Promise.reject(err)
    }
  } else if (Config.useResourceTemplateFixtures && isTemplate) {
    fetchPromise = Promise.reject(new Error('Not found'))
  } else {
    fetchPromise = fetch(uri, {
      headers: { Accept: 'application/json' },
    })
      .then((resp) => checkResp(resp)
        .then(() => resp.json()))
  }

  return fetchPromise
    .then((response) => Promise.all([datasetFromJsonld(response.data), Promise.resolve(response)]))
    .catch((err) => {
      throw new Error(`Error parsing resource: ${err.message || err}`)
    })
}

// Publishes (saves) a new resource in Trellis
export const postResource = (resource, currentUser, group) => {
  const newResource = { ...resource }
  // Mint a uri. Resource templates use the template id.
  const resourceId = isTemplate(resource) ? templateIdFor(resource) : uuidv4()
  const uri = `${Config.sinopiaApiBase}/resource/${resourceId}`
  newResource.uri = uri
  newResource.group = group
  return putResource(newResource, currentUser, 'POST')
    .then(() => uri)
}

// Saves an existing resource in Trellis
export const putResource = (resource, currentUser, method) => saveBodyForResource(resource, currentUser.username, resource.group)
  .then((body) => getJwt()
    .then((jwt) => fetch(resource.uri, {
      method: method || 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body,
    })
      .then((resp) => checkResp(resp)
        .then(() => true))))

export const postMarc = (resourceUri) => {
  const url = resourceUri.replace('resource', 'marc')
  return getJwt()
    .then((jwt) => fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }))
    .then((resp) => checkResp(resp)
      .then(() => resp.headers.get('Content-Location')))
}

export const getMarcJob = (marcJobUrl) => fetch(marcJobUrl)
  .then((resp) => checkResp(resp)
    .then(() => {
      // Will return 200 if job is not yet completed.
      // Will return 303 if job completed. Fetch automatically redirects,
      // which retrieves the MARC text.
      if (!resp.redirected) return [undefined, undefined]
      return resp.text()
        .then((body) => [resp.url, body])
    }))

export const getMarc = (marcUrl, asText) => fetch(marcUrl, {
  headers: {
    Accept: asText ? 'text/plain' : 'application/marc',
  },
})
  .then((resp) => checkResp(resp)
    .then(() => resp.blob()))

const saveBodyForResource = (resource, user, group) => {
  const dataset = new GraphBuilder(resource).graph

  return jsonldFromDataset(dataset)
    .then((jsonld) => JSON.stringify({
      data: jsonld,
      user,
      group,
      templateId: resource.subjectTemplate.id,
      types: [resource.subjectTemplate.class],
      bfAdminMetadataRefs: resource.bfAdminMetadataRefs,
      bfItemRefs: resource.bfItemRefs,
      bfInstanceRefs: resource.bfInstanceRefs,
      bfWorkRefs: resource.bfWorkRefs,
    }))
}

const isTemplate = (resource) => resource.subjectTemplate.id === 'sinopia:template:resource'

const templateIdFor = (resource) => {
  const resourceIdProperty = resource.properties.find((property) => property.propertyTemplate.uri === 'http://sinopia.io/vocabulary/hasResourceId')
  return resourceIdProperty.values[0].uri
}

const getJwt = () => Auth.currentSession()
  .then((data) => {
    if (!data.idToken.jwtToken) throw new Error('jwt is undefined')
    return data.idToken.jwtToken
  })

const checkResp = (resp) => {
  if (resp.ok) return Promise.resolve()
  return resp.json()
    .then((errors) => {
      // Assuming only one for now.
      const error = errors[0]
      const newError = new Error(`${error.title}: ${error.details}`)
      newError.name = 'ApiError'
      throw newError
    })
    .catch((err) => {
      if (err.name === 'ApiError') throw err
      throw new Error(`Sinopia API returned ${resp.statusText}`)
    })
}
