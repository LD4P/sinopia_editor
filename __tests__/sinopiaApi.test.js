// Copyright 2020 Stanford University see LICENSE for license
import {
  fetchResource, postResource, putResource,
  postMarc, getMarcJob, getMarc, fetchUser, putUserHistory,
} from 'sinopiaApi'
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
  editGroups: 'cornell',
  types: [
    'https://w3id.org/arm/core/ontology/0.1/Enclosure',
  ],
  user: 'tat2',
  timestamp: '2020-02-18T21:12:19.053Z',
  templateId: 'Yale:RT:ARM:Enclosure:CtY',
  id: 'yale/61f2f457-31f5-432c-8acf-b4037f77541f',
  uri: 'https://api.development.sinopia.io/resource/61f2f457-31f5-432c-8acf-b4037f77541f',
}


jest.spyOn(Auth, 'currentSession').mockResolvedValue({ idToken: { jwtToken: 'Secret-Token' } })

// Saves global fetch in order to be restored after each test with mocked fetch
const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
})

describe('fetchResource', () => {
  describe('when using fixtures', () => {
    // This forces Sinopia parsing_exception to use fixtures
    jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

    it('retrieves resource template', async () => {
      const result = await fetchResource('http://localhost:3000/resource/resourceTemplate:bf2:Note')
      expect(result).toBeTruthy()
      expect(result[1].id).toBe('resourceTemplate:bf2:Note')
    })

    it('errors if fixture does not exist', async () => {
      expect.assertions(1)
      await expect(fetchResource('http://localhost:3000/resource/ld4p:RT:bf2:xxx')).rejects.toThrow('Error parsing resource: Error retrieving resource: Not Found')
    })
  })

  describe('when using the api', () => {
    it('retrieves resource', async () => {
      // mocks call to Sinopia API for a resource
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(resource),
        ok: true,
      })

      const result = await fetchResource('https://api.development.sinopia.io/resource/yale/61f2f457-31f5-432c-8acf-b4037f77541f')
      expect(result[1].id).toBe('yale/61f2f457-31f5-432c-8acf-b4037f77541f')
      expect(result[1].user).toBe('tat2')
    })

    it('errors when unable to retrieve resource', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockRejectedValue('Parse error'),
        statusText: 'failed to retrieve uri',
        ok: false,
      })

      await expect(fetchResource('http://api.sinopia.io/resource/12334')).rejects.toThrow('Error parsing resource: Sinopia API returned failed to retrieve uri')
    })
  })
})

describe('postResource', () => {
  const state = createState({ hasResourceWithLiteral: true })
  const currentUser = selectUser(state)

  describe('with a new resource', () => {
    const resource = selectFullSubject(state, 't9zVwg2zO')

    it('saves the new resource and returns uri', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue(resource),
        ok: true,
      })
      const result = await postResource(resource, currentUser, 'pcc', ['cornell'])
      expect(result).toContain('http://localhost:3000/resource/')
    })
  })

  describe('with a new resource template', () => {
    const resource = selectFullSubject(state, 't9zVwg2zO')

    it('saves the new resource template and returns uri', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true })
      // Mocks a resource template
      resource.subjectTemplate.id = 'sinopia:template:resource'
      resource.properties.push({
        propertyTemplate: {
          uri: 'http://sinopia.io/vocabulary/hasResourceId',
          type: 'literal',
        },
        values: [{
          literal: 'resourceTemplate:bf2:Note',
          property: { propertyTemplate: { type: 'literal' } },
        }],
      })
      const result = await postResource(resource, currentUser, 'pcc', ['cornell'])
      expect(result).toBe('http://localhost:3000/resource/resourceTemplate:bf2:Note')
    })
  })
})

describe('putResource', () => {
  describe('when changed resource is sent to the api', () => {
    const state = createState({ hasResourceWithLiteral: true })
    const resource = selectFullSubject(state, 't9zVwg2zO')
    const currentUser = selectUser(state)

    it('saves the resource', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true })
      const result = await putResource(resource, currentUser)
      expect(result).toBeTruthy()
    })

    it('errors if save failed', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: jest.fn().mockRejectedValue('Parse error'),
        statusText: 'Cannot save resource',
      })
      await expect(putResource(resource, currentUser)).rejects.toThrow('Sinopia API returned Cannot save resource')
    })
  })
})

const resourceUri = 'https://api.development.sinopia.io/resource/7b4c275d-b0c7-40a4-80b3-e95a0d9d987c'
const marcPostUrl = 'https://api.development.sinopia.io/marc/7b4c275d-b0c7-40a4-80b3-e95a0d9d987c'
const jobUrl = 'https://api.development.sinopia.io/marc/7b4c275d-b0c7-40a4-80b3-e95a0d9d987c/job/jlittman/2020-09-10T12:01:58.114Z'
const marcUrl = 'https://api.development.sinopia.io/marc/70c5e814-a0f6-48cb-a4e5-91a5a71aae29/version/jlittman/2020-09-10T13:38:35.751Z'
const marcTxt = 'This is the MARC text.'
const marcBlob = 'xjkdfirwif2'

describe('postMarc', () => {
  describe('success', () => {
    it('returns MARC job URL', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, headers: { get: jest.fn().mockReturnValue(jobUrl) } })

      expect(await postMarc(resourceUri)).toEqual(jobUrl)
      expect(global.fetch).toHaveBeenCalledWith(marcPostUrl, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer Secret-Token',
        },
      })
    })
  })

  describe('failure', () => {
    it('throws', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, json: jest.fn().mockResolvedValue([{ title: 'Ooops!', details: 'It failed.' }]) })

      await expect(postMarc(resourceUri)).rejects.toThrow('Ooops!: It failed.')
    })
  })
})

describe('getMarcJob', () => {
  describe('job not completed', () => {
    it('returns undefined', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, redirected: false })

      expect(await getMarcJob(jobUrl)).toEqual([undefined, undefined])
      expect(global.fetch).toHaveBeenCalledWith(jobUrl)
    })
  })

  describe('job completed', () => {
    it('returns MARC url and MARC text', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true, redirected: true, url: marcUrl, text: jest.fn().mockResolvedValue(marcTxt),
      })

      expect(await getMarcJob(jobUrl)).toEqual([marcUrl, marcTxt])
    })
  })

  describe('failure', () => {
    it('throws', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, json: jest.fn().mockResolvedValue([{ title: 'Ooops!', details: 'It failed.' }]) })

      await expect(getMarcJob(jobUrl)).rejects.toThrow('Ooops!: It failed.')
    })
  })
})

describe('getMarc', () => {
  describe('getting MARC text', () => {
    it('returns blob', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, blob: jest.fn().mockResolvedValue(marcBlob) })

      expect(await getMarc(marcUrl)).toEqual(marcBlob)
      expect(global.fetch).toHaveBeenCalledWith(marcUrl, { headers: { Accept: 'application/marc' } })
    })
  })

  describe('getting MARC record', () => {
    it('returns blob', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, blob: jest.fn().mockResolvedValue(marcBlob) })

      expect(await getMarc(marcUrl, true)).toEqual(marcBlob)
      expect(global.fetch).toHaveBeenCalledWith(marcUrl, { headers: { Accept: 'text/plain' } })
    })
  })

  describe('failure', () => {
    it('throws', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false, json: jest.fn().mockResolvedValue([{ title: 'Ooops!', details: 'It failed.' }]) })

      await expect(getMarc(marcUrl)).rejects.toThrow('Ooops!: It failed.')
    })
  })
})

const userData = { id: 'tmann', data: {} }
describe('fetchUser', () => {
  describe('user is found', () => {
    it('returns user data', async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(userData) })

      expect(await fetchUser('tmann')).toEqual(userData)
    })
  })

  describe('user is not found', () => {
    it('creates user and returns data', async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, status: 404 }).mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(userData) })

      expect(await fetchUser('tmann')).toEqual(userData)

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/user/tmann', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer Secret-Token',
        },
      })
    })
  })
})

describe('putUserHistory', () => {
  it('puts to API', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(userData) })

    expect(await putUserHistory('tmann', 'template', 'abc123', 'template1')).toEqual(userData)

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/user/tmann/history/template/abc123', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer Secret-Token',
        'Content-Type': 'application/json',
      },
      body: '{"payload":"template1"}',
    })
  })
})
