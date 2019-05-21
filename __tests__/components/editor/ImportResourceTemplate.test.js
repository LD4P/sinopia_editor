// Copyright 2019 Stanford University see Apache2.txt for license

import 'isomorphic-fetch'
import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import CognitoUtils from '../../../src/CognitoUtils'
import ImportFileZone from '../../../src/components/editor/ImportFileZone'
import ImportResourceTemplate from '../../../src/components/editor/ImportResourceTemplate'
import SinopiaResourceTemplates from '../../../src/components/editor/SinopiaResourceTemplates'

// Fake out the sinopia client
import SinopiaClientErrorFake from '../../../__mocks__/SinopiaClientErrorFake'
import SinopiaClientSuccessFake from '../../../__mocks__/SinopiaClientSuccessFake'

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
    // TODO: may need to mock in the same way as e.g. SinopiaClientSuccessFake, per https://jestjs.io/docs/en/manual-mocks.html#mocking-user-modules
    // incorrect mock approach may explay why below still tries to call out to cognitoUser.getSession, when the CognitoUtils wrapper that ultimately
    // calls that should have been replaced by a simple mocked implementation (which returns a promise that resolves to a fake token).
    // const tokenSpy = jest.spyOn(CognitoUtils, 'getIdTokenString')
    //                   .mockImplementation(() => new Promise(function(resolve, _reject) { resolve('entirelyLegitIdToken') }))
    // const tokenSpy = jest.spyOn(CognitoUtils, 'getIdTokenString').mockReturnValue(async () => 'entirelyLegitIdToken')
    // const tokenSpy = jest.spyOn(CognitoUtils, 'getIdTokenString').mockImplementation(async () => 'entirelyLegitIdToken')

    // afterAll(() => { tokenSpy.mockRestore() })

    // TODO: will fix as part of #528 (or a ticket spawned by #528)
    it.skip('returns response from sinopia client call when successful', async () => {
      wrapper.instance().instance = new SinopiaClientSuccessFake()

      const response = await wrapper.instance().createResource({ foo: 'bar'}, 'ld4p')

      expect(response).toEqual('i am a response for a created object')
    })

    // TODO: will fix as part of #528 (or a ticket spawned by #528)
    it.skip('returns error response and adds to state when client call fails', async () => {
      wrapper.instance().instance = new SinopiaClientErrorFake()

      const setStateSpy = jest.spyOn(wrapper.instance(), 'setState').mockReturnValue(null)
      const response = await wrapper.instance().createResource({ foo: 'bar'}, 'ld4p')

      expect(response).toEqual('i am an error for a created object')
      expect(setStateSpy).toHaveBeenCalledWith({
        createResourceError: ['i am an error for a created object']
      })
    })

    // TODO: test scenario where id token retrieval fails (e.g. expired refresh token)
  })

  describe('updateResource()', () => {
    it('returns response from sinopia client call when successful', async () => {
      wrapper.instance().instance = new SinopiaClientSuccessFake()

      const response = await wrapper.instance().updateResource({ foo: 'bar'}, 'ld4p')

      expect(response).toEqual('i am a response for an updated object')
    })

    it('returns error response when client call fails', async () => {
      wrapper.instance().instance = new SinopiaClientErrorFake()

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
