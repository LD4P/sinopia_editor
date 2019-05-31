// Copyright 2019 Stanford University see LICENSE for license

import 'isomorphic-fetch'
import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import ImportFileZone from '../../../src/components/editor/ImportFileZone'
import ImportResourceTemplate from '../../../src/components/editor/ImportResourceTemplate'
import SinopiaResourceTemplates from '../../../src/components/editor/SinopiaResourceTemplates'
import { createResourceTemplate, updateResourceTemplate } from '../../../src/sinopiaServer'

jest.mock('../../../src/sinopiaServer')

describe('<ImportResourceTemplate />', () => {
  const authenticationState = {
    currentUser: {
      wouldActuallyBe: 'a CognitoUser object, IRL',
    },
  }
  let wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

  // Make sure spies/mocks don't leak between tests
  afterEach(() => {
    jest.restoreAllMocks()
  })

  // This test should be expanded when the Import Resource Template page is further defined
  it('contains the main div', () => {
    expect(wrapper.find('div#importResourceTemplate').length).toBe(1)
  })

  it('contains the place to import a file', () => {
    expect(wrapper.find(ImportFileZone).length).toBe(1)
  })

  it('contains a place to display the resource templates stored on the server', () => {
    expect(wrapper.find(SinopiaResourceTemplates).length).toBe(1)
  })

  describe('setResourceTemplates()', () => {
    const content = {
      Profile: {
        resourceTemplates: [
          {
            id: 'template1',
          },
          {
            id: 'template2',
          },
        ],
      },
    }

    it('resets messages, creates one resource per template, and then updates state', async () => {
      const createResourceSpy = jest.spyOn(wrapper.instance(), 'createResource').mockImplementation(async () => {})
      const updateStateSpy = jest.spyOn(wrapper.instance(), 'updateStateFromServerResponses').mockReturnValue(null)
      const resetMessagesSpy = jest.spyOn(wrapper.instance(), 'resetMessages').mockReturnValue(null)

      await wrapper.instance().setResourceTemplates(content, 'ld4p')

      expect(createResourceSpy).toHaveBeenCalledTimes(2)
      expect(updateStateSpy).toHaveBeenCalledTimes(1)
      expect(resetMessagesSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('createResource()', () => {
    it('returns response from sinopia client call when successful', async () => {
      createResourceTemplate.mockImplementation(async () => ({
        response: 'i am a response for a created object',
      }))

      const response = await wrapper.instance().createResource({ foo: 'bar' }, 'ld4p')

      expect(response).toEqual('i am a response for a created object')
    })

    it('returns error response and adds to state when client call fails', async () => {
      createResourceTemplate.mockImplementation(async () => {
        throw {
          response: 'i am an error for a created object',
        }
      })

      const setStateSpy = jest.spyOn(wrapper.instance(), 'setState').mockReturnValue(null)
      const response = await wrapper.instance().createResource({ foo: 'bar' }, 'ld4p')

      expect(response).toEqual('i am an error for a created object')
      expect(setStateSpy).toHaveBeenCalledWith({
        modalMessages: ['i am an error for a created object'],
      })
    })

    // TODO: test scenario where id token retrieval fails (e.g. expired refresh token) for #528
  })

  describe('updateResource()', () => {
    it('returns response from sinopia client call when successful', async () => {
      updateResourceTemplate.mockImplementation(async () => ({
        response: 'i am a response for an updated object',
      }))

      const response = await wrapper.instance().updateResource({ foo: 'bar' }, 'ld4p')

      expect(response).toEqual('i am a response for an updated object')
    })

    it('returns error response when client call fails', async () => {
      updateResourceTemplate.mockImplementation(async () => {
        throw {
          response: 'i am an error for an updated object',
        }
      })

      const response = await wrapper.instance().updateResource({ foo: 'bar' }, 'ld4p')

      expect(response).toEqual('i am an error for an updated object')
    })
  })

  describe('updateStateFromServerResponses()', () => {
    it('adds error message to state when update operation does *not* result in HTTP 409 Conflict', () => {
      // Set new wrapper in each of these tests because we are changing state
      wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

      expect(wrapper.state().flashMessages).toEqual([])

      wrapper.instance().updateStateFromServerResponses([{ status: 200, headers: {} }])

      expect(wrapper.state().flashMessages).toEqual(['Unexpected response (200)! '])
    })

    it('sets modalShow to true when receiving HTTP 409 and errors >= profileCount', () => {
      // Set new wrapper in each of these tests because we are changing state
      wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

      expect(wrapper.state().modalShow).toBe(false)

      wrapper.instance().updateStateFromServerResponses([{ status: 409, headers: {} }])

      expect(wrapper.state().modalShow).toBe(true)
    })

    it('sets message in state with any create operation not resulting in HTTP 409', () => {
      // Set new wrapper in each of these tests because we are changing state
      wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

      expect(wrapper.state().flashMessages).toEqual([])

      wrapper.instance().updateStateFromServerResponses([{ status: 201, headers: { location: 'http://sinopia.io/repository/ld4p/myResourceTemplate' } }])

      expect(wrapper.state().flashMessages).toEqual(['Created http://sinopia.io/repository/ld4p/myResourceTemplate'])
    })

    it('handles multi-response calls with different results', () => {
      // Set new wrapper in each of these tests because we are changing state
      wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

      expect(wrapper.state().flashMessages).toEqual([])
      expect(wrapper.state().modalShow).toEqual(false)
      expect(wrapper.state().updateKey).toEqual(1)

      wrapper.instance().updateStateFromServerResponses([
        { status: 201, headers: { location: 'http://sinopia.io/repository/ld4p/myResourceTemplate1' } },
        { status: 409, headers: { location: 'http://sinopia.io/repository/ld4p/myResourceTemplate2' } },
      ])

      expect(wrapper.state().flashMessages).toEqual([
        'Created http://sinopia.io/repository/ld4p/myResourceTemplate1',
        'Prompting user about updating http://sinopia.io/repository/ld4p/myResourceTemplate2',
      ])
      expect(wrapper.state().modalShow).toEqual(true)
      expect(wrapper.state().updateKey).toEqual(2)
    })
  })

  describe('humanReadableLocation()', () => {
    it('returns human-readable label when Location header exists', () => {
      const response = {
        headers: {
          location: 'http://sinopia.io/repository/ld4p/myResourceTemplate',
        },
        req: {
          url: 'http://sinopia.io/repository/ld4p',
          _data: {
            id: 'myResourceTemplate',
          },
        },
      }

      expect(wrapper.instance().humanReadableLocation(response)).toEqual('http://sinopia.io/repository/ld4p/myResourceTemplate')
    })

    it('returns human-readable label when data ID exists', () => {
      const response = {
        req: {
          url: 'http://sinopia.io/repository/ld4p',
          _data: {
            id: 'myResourceTemplate',
          },
        },
      }

      expect(wrapper.instance().humanReadableLocation(response)).toEqual('http://sinopia.io/repository/ld4p/myResourceTemplate')
    })

    it('returns human-readable label when request URL already includes data ID', () => {
      const response = {
        req: {
          url: 'http://sinopia.io/repository/ld4p/myResourceTemplate',
          _data: {
            id: 'myResourceTemplate',
          },
        },
      }

      expect(wrapper.instance().humanReadableLocation(response)).toEqual('http://sinopia.io/repository/ld4p/myResourceTemplate')
    })

    it('returns human-readable label when *encoded* request URL already includes data ID', () => {
      const response = {
        req: {
          url: 'http://sinopia.io/repository/ld4p/my%3AResource%3ATemplate',
          _data: {
            id: 'my:Resource:Template',
          },
        },
      }

      expect(wrapper.instance().humanReadableLocation(response)).toEqual('http://sinopia.io/repository/ld4p/my:Resource:Template')
    })

    it('returns an empty label otherwise', () => {
      const response = undefined

      expect(wrapper.instance().humanReadableLocation(response)).toEqual('')
    })
  })

  describe('humanReadableStatus()', () => {
    it('returns human-readable label for HTTP 201', () => {
      expect(wrapper.instance().humanReadableStatus(201)).toEqual('Created')
    })

    it('returns human-readable label for HTTP 204', () => {
      expect(wrapper.instance().humanReadableStatus(204)).toEqual('Updated')
    })

    it('returns human-readable label for HTTP 401', () => {
      expect(wrapper.instance().humanReadableStatus(401)).toEqual('You are not authorized to do this. Try logging in again!')
    })

    it('returns human-readable label for HTTP 409', () => {
      expect(wrapper.instance().humanReadableStatus(409)).toEqual('Prompting user about updating')
    })

    it('returns human-readable label for any other HTTP status', () => {
      expect(wrapper.instance().humanReadableStatus(400)).toEqual('Unexpected response (400)!')
    })
  })

  describe('resetMessages()', () => {
    it('resets modalMessages and flashMessages in component state', () => {
      // Set new wrapper because we are changing state
      wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

      wrapper.setState({ modalMessages: ['Could not update resource!'], flashMessages: ['Updated http:sinopia.io/repository/ld4p/myResourceTemplate'] })
      expect(wrapper.state().modalMessages).toEqual(['Could not update resource!'])
      expect(wrapper.state().flashMessages).toEqual(['Updated http:sinopia.io/repository/ld4p/myResourceTemplate'])

      wrapper.instance().resetMessages()

      expect(wrapper.state().modalMessages).toEqual([])
      expect(wrapper.state().flashMessages).toEqual([])
    })
  })

  describe('modalClose()', () => {
    it('sets modalShow to false in component state', () => {
      // Set new wrapper because we are changing state
      wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

      wrapper.setState({ modalShow: true })
      expect(wrapper.state().modalShow).toBe(true)

      wrapper.instance().modalClose()

      expect(wrapper.state().modalShow).toBe(false)
    })
  })

  describe('handleUpdateResource()', () => {
    const templates = [
      {
        id: 'template1',
      },
      {
        id: 'template2',
      },
    ]

    it('updates every template, updates state, closes the modal and reloads', async () => {
      const updateResourceSpy = jest.spyOn(wrapper.instance(), 'updateResource').mockImplementation(async () => {})
      const updateStateSpy = jest.spyOn(wrapper.instance(), 'updateStateFromServerResponses').mockReturnValue(null)
      const modalCloseSpy = jest.spyOn(wrapper.instance(), 'modalClose').mockReturnValue(null)

      await wrapper.instance().handleUpdateResource(templates, 'ld4p')

      expect(updateResourceSpy).toHaveBeenCalledTimes(2)
      expect(updateStateSpy).toHaveBeenCalledTimes(1)
      expect(modalCloseSpy).toHaveBeenCalledTimes(1)
    })
  })
})
