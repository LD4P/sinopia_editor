// Copyright 2019 Stanford University see Apache2.txt for license

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
  let authenticationState = {
    currentUser: {
      wouldActuallyBe: 'a CognitoUser object, IRL'
    }
  }
  let wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

  // Make sure spies/mocks don't leak between tests
  afterEach(() => {
    jest.restoreAllMocks()
  })

  //This test should be expanded when the Import Resource Template page is further defined
  it('contains the main div', () => {
    expect(wrapper.find("div#importResourceTemplate").length).toBe(1)
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
            id: 'template1'
          },
          {
            id: 'template2'
          }
        ]
      }
    }

    it('invokes createResource() and updateStateFromServerResponse() once per template', async () => {
      const createResourceSpy = jest.spyOn(wrapper.instance(), 'createResource').mockImplementation(async () => {})
      const updateStateSpy = jest.spyOn(wrapper.instance(), 'updateStateFromServerResponse').mockReturnValue(null)

      await wrapper.instance().setResourceTemplates(content, 'ld4p')

      expect(createResourceSpy).toHaveBeenCalledTimes(2)
      expect(updateStateSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe('createResource()', () => {
    it('returns response from sinopia client call when successful', async () => {
      createResourceTemplate.mockImplementation(async () => {
        return {
          response: 'i am a response for a created object'
        }
      })

      const response = await wrapper.instance().createResource({ foo: 'bar'}, 'ld4p')

      expect(response).toEqual('i am a response for a created object')
    })

    it('returns error response and adds to state when client call fails', async () => {
      createResourceTemplate.mockImplementation(async () => {
        throw {
          response: 'i am an error for a created object'
        }
      })

      const setStateSpy = jest.spyOn(wrapper.instance(), 'setState').mockReturnValue(null)
      const response = await wrapper.instance().createResource({ foo: 'bar'}, 'ld4p')

      expect(response).toEqual('i am an error for a created object')
      expect(setStateSpy).toHaveBeenCalledWith({
        createResourceError: ['i am an error for a created object']
      })
    })

    // TODO: test scenario where id token retrieval fails (e.g. expired refresh token) for #528
  })

  describe('updateResource()', () => {
    it('returns response from sinopia client call when successful', async () => {
      updateResourceTemplate.mockImplementation(async () => {
        return {
          response: 'i am a response for an updated object'
        }
      })

      const response = await wrapper.instance().updateResource({ foo: 'bar'}, 'ld4p')

      expect(response).toEqual('i am a response for an updated object')
    })

    it('returns error response when client call fails', async () => {
      updateResourceTemplate.mockImplementation(async () => {
        throw {
          response: 'i am an error for an updated object'
        }
      })

      const response = await wrapper.instance().updateResource({ foo: 'bar'}, 'ld4p')

      expect(response).toEqual('i am an error for an updated object')
    })
  })

  describe('updateStateFromServerResponse()', () => {
    it('adds error message to state when update operation does *not* result in HTTP 409 Conflict', () => {
      // Set new wrapper in each of these tests because we are changing state
      wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

      expect(wrapper.state().message).toEqual([])

      wrapper.instance().updateStateFromServerResponse({ status: 200, headers: {} })

      expect(wrapper.state().message).toEqual(['Unexpected response (200)! '])
    })
    it('sets modalShow to true when receiving HTTP 409 and errors >= profileCount', () => {
      // Set new wrapper in each of these tests because we are changing state
      wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

      expect(wrapper.state().modalShow).toBe(false)

      wrapper.instance().updateStateFromServerResponse({ status: 409 , headers: {} }, 0)
      expect(wrapper.state().modalShow).toBe(true)
    })
    it('sets message in state with any create operation not resulting in HTTP 409', () => {
      // Set new wrapper in each of these tests because we are changing state
      wrapper = shallow(<ImportResourceTemplate.WrappedComponent authenticationState={authenticationState}/>)

      expect(wrapper.state().message).toEqual([])

      wrapper.instance().updateStateFromServerResponse({ status: 201 , headers: { location: 'http://foo.bar' } })

      expect(wrapper.state().message).toEqual(['Created http://foo.bar'])
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
      expect(wrapper.instance().humanReadableStatus(409)).toEqual('Attempting to update')
    })
    it('returns human-readable label for any other HTTP status', () => {
      expect(wrapper.instance().humanReadableStatus(400)).toEqual('Unexpected response (400)!')
    })
  })

  describe('handleUpdateResource()', () => {
    const templates =  [
      {
        id: 'template1'
      },
      {
        id: 'template2'
      }
    ]

    it('updates every template, updates state, closes the modal and reloads', async () => {
      const updateResourceSpy = jest.spyOn(wrapper.instance(), 'updateResource').mockImplementation(async () => {})
      const updateStateSpy = jest.spyOn(wrapper.instance(), 'updateStateFromServerResponse').mockReturnValue(null)
      const modalCloseSpy = jest.spyOn(wrapper.instance(), 'modalClose').mockReturnValue(null)

      await wrapper.instance().handleUpdateResource(templates, 'ld4p')

      expect(updateResourceSpy).toHaveBeenCalledTimes(2)
      expect(updateStateSpy).toHaveBeenCalledTimes(2)
      expect(modalCloseSpy).toHaveBeenCalledTimes(1)
    })
  })
})
