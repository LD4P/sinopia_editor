// Copyright 2020 Stanford University see LICENSE for license
import { fetchResource, postResource, putResource } from 'sinopiaApi'
import { selectFullSubject } from 'selectors/resources'
import { selectUser } from 'selectors/authenticate'
import { createState } from 'stateUtils'
import Auth from '@aws-amplify/auth'

import Config from 'Config'

const resource = {
  data: [
    {
      '@id': '_:b1',
      '@type': [
        'http://id.loc.gov/ontologies/bibframe/CollectiveTitle',
      ],
      'http://id.loc.gov/ontologies/bibframe/mainTitle': [
        {
          '@value': 'Columbia University minor publications',
          '@language': 'eng',
        },
      ],
    },
    {
      '@id': 'https://id.loc.gov/vocabulary/languages/eng',
      'http://www.w3.org/2000/01/rdf-schema#label': [
        {
          '@value': 'English',
        },
      ],
    }],
  bfAdminMetadataRefs: [],
  bfInstanceRefs: [],
  bfItemRefs: [],
  bfWorkRefs: [],
  group: 'yale',
  types: [
    'https://w3id.org/arm/core/ontology/0.1/Enclosure',
  ],
  user: 'tat2',
  timestamp: '2020-02-18T21:12:19.053Z',
  templateId: 'Yale:RT:ARM:Enclosure:CtY',
  id: 'yale/61f2f457-31f5-432c-8acf-b4037f77541f',
  uri: 'https://api.development.sinopia.io/repository/yale/61f2f457-31f5-432c-8acf-b4037f77541f',
}


jest.spyOn(Auth, 'currentSession').mockReturnValue(new Promise((resolve) => {
  resolve({
    idToken: {
      jwtToken: 'Secret-Token',
    },
  })
}))

// Saves global fetch in order to be restored after each test with mocked fetch
const originalFetch = global.fetch

describe('fetchResource', () => {
  describe('when using fixtures', () => {
    // This forces Sinopia parsing_exception to use fixtures
    jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

    it('retrieves resource template', async () => {
      const result = await fetchResource('http://localhost:3000/repository/resourceTemplate:bf2:Note')
      expect(result).toBeTruthy()
      expect(result[1].id).toBe('resourceTemplate:bf2:Note')
    })

    it('errors if fixture does not exist', async () => {
      expect.assertions(1)
      try {
        await fetchResource('http://localhost:3000/repository/ld4p:RT:bf2:xxx')
      } catch (e) {
        expect(e.message).toBe('Error parsing resource: Error retrieving resource: Not Found')
      }
    })
  })

  describe('when using the api', () => {
    afterEach(() => {
      global.fetch = originalFetch
    })

    it('retrieves resource', async () => {
      // mocks call to Sinopia API for a resource
      global.fetch = jest.fn(() => new Promise((resolve) => (
        resolve({
          json: () => new Promise((resolve) => resolve(resource)),
          ok: true,
        }))))

      const result = await fetchResource('https://api.development.sinopia.io/repository/yale/61f2f457-31f5-432c-8acf-b4037f77541f')
      expect(result[1].id).toBe('yale/61f2f457-31f5-432c-8acf-b4037f77541f')
      expect(result[1].user).toBe('tat2')
    })

    it('errors when unable to retrieve resource', async () => {
      expect.assertions(1)
      global.fetch = jest.fn(() => new Promise((resolve) => (
        resolve({
          statusText: 'failed to retrieve uri',
          ok: false,
        })
      )))
      try {
        await fetchResource('http://api.sinopia.io/repository/12334')
      } catch (e) {
        expect(e.message).toBe('Error parsing resource: Error retrieving resource: failed to retrieve uri')
      }
    })
  })
})

describe('postResource', () => {
  const state = createState({ hasResourceWithLiteral: true })
  const currentUser = selectUser(state)

  describe('with a new resource', () => {
    const resource = selectFullSubject(state, 't9zVwg2zO')

    afterEach(() => {
      global.fetch = originalFetch
    })

    it('saves the new resource and returns uri', async () => {
      global.fetch = jest.fn(() => new Promise((resolve) => (
        resolve({
          json: () => new Promise((resolve) => resolve(resource)),
          ok: true,
        }))))
      const result = await postResource(resource, currentUser, 'pcc')
      expect(result).toContain('http://localhost:3000/repository/')
    })
  })

  describe('with a new resource template', () => {
    const resource = selectFullSubject(state, 't9zVwg2zO')

    it('saves the new resource template and returns uri', async () => {
      global.fetch = jest.fn(() => new Promise((resolve) => (
        resolve({ ok: true })
      )))
      // Mocks a resource template
      resource.subjectTemplate.id = 'sinopia:template:resource'
      resource.properties.push({
        propertyTemplate: {
          uri: 'http://sinopia.io/vocabulary/hasResourceId',
          type: 'uri',
        },
        values: [{
          uri: 'resourceTemplate:bf2:Note',
          property: { propertyTemplate: { type: 'uri' } },
        }],
      })
      const result = await postResource(resource, currentUser, 'pcc')
      expect(result).toBe('http://localhost:3000/repository/resourceTemplate:bf2:Note')
    })
  })
})

describe('putResource', () => {
  describe('when changed resource is sent to the api', () => {
    const state = createState({ hasResourceWithLiteral: true })
    const resource = selectFullSubject(state, 't9zVwg2zO')
    const currentUser = selectUser(state)

    afterEach(() => {
      global.fetch = originalFetch
    })

    it('saves the resource', async () => {
      global.fetch = jest.fn(() => new Promise((resolve) => (
        resolve({ ok: true })
      )))
      const result = await putResource(resource, currentUser)
      expect(result).toBeTruthy()
    })

    it('errors if save failed', async () => {
      global.fetch = jest.fn(() => new Promise((resolve) => (
        resolve({
          ok: false,
          statusText: 'Cannot save resource',
        })
      )))
      try {
        await putResource(resource, currentUser)
      } catch (e) {
        expect(e.message).toBe('Sinopia API returned Cannot save resource')
      }
    })
  })
})
