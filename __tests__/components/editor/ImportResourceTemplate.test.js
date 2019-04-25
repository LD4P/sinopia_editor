// Copyright 2019 Stanford University see Apache2.txt for license

import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import ImportResourceTemplate from '../../../src/components/editor/ImportResourceTemplate'
import ImportFileZone from '../../../src/components/editor/ImportFileZone'
import SinopiaResourceTemplates from '../../../src/components/editor/SinopiaResourceTemplates'
import 'isomorphic-fetch'

describe('<ImportResourceTemplate />', () => {
  const wrapper = shallow(<ImportResourceTemplate />)
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

})

const mockResponse = (status, statusText, response) => {
  return new Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  }).body
}

describe('creating a non-rdf resource from an uploaded profile', () => {
  const result = {
    data: null,
    response: {
      headers: {
        location: "http://localhost:8080/repository/ld4p/resourceTemplate:bf2:Note"
      }
    }
  }

  it('sets an info message that the resource was created on success', async () => {
    const wrapper = shallow(<ImportResourceTemplate />)
    const promise = Promise.resolve(mockResponse(201, "Created", result))
    await wrapper.instance().fulfillCreateResourcePromise(promise)
    expect(wrapper.state('message')).toEqual([ `${result.response.statusText} ${result.response.headers.location}` ])
  })

  it('shows the error message if resource creation fails', async () => {
    const wrapper = shallow(<ImportResourceTemplate />)
    const promise = Promise.resolve(mockResponse(500, "Bad request", null))
    wrapper.setState({createResourceError: [{statusText: "Bad request"}]})
    await wrapper.instance().fulfillCreateResourcePromise(promise)
    await wrapper.update()
    expect(wrapper.state().message).toEqual( [ 'The sinopia server is not accepting the request for this resource.' ])
  })

  it('does not display the error/info alert if the response status is Conflict', async () => {
    const wrapper = shallow(<ImportResourceTemplate />)
    const promise = Promise.resolve(mockResponse(409, "Conflict", null))
    wrapper.setState({createResourceError: [{statusText: "Conflict"}]})
    await wrapper.instance().fulfillCreateResourcePromise(promise)
    await wrapper.update()
    expect(wrapper.state().message).toEqual([])
  })

  const content = { Profile: { resourceTemplates: [ {propertyTemplates: {}} ]}}

  it('increments and sets the state with an update key to pass into child component to avoid infinite recursion', async () => {
    const wrapper = shallow(<ImportResourceTemplate />)
    const promise = Promise.resolve(mockResponse(201, "Created", result))
    wrapper.instance().fulfillCreateResourcePromise(promise)
    wrapper.instance().setResourceTemplates(content, 'ld4p')
    expect(wrapper.state().updateKey).toBeGreaterThan(0)
  })

  it('sets the conflict errors to be handles by the update functionality', () => {
    const responseMock = {
      response: {
        "req": {
          "method":"POST",
          "url":"http://localhost:8080/repository/ld4p",
          "_data": {},
        },
        "statusText":"Conflict",
        "statusCode":409,
        "status":409
      }
    }
    const wrapper = shallow(<ImportResourceTemplate />)
    const error = mockResponse(409, "Conflict", responseMock)
    wrapper.instance().updateStateForResourceError(error)
    wrapper.update()
    expect(wrapper.state().createResourceError).toEqual([responseMock.response])
  })
  
})

