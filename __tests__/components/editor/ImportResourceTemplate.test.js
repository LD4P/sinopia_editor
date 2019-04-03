// Copyright 2019 Stanford University see Apache2.txt for license

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
    await wrapper.instance().fulfillCreateResourcePromise(promise)
    //TODO: why does the component not set state in the catch block via the test...
    // expect(wrapper.state('message')).toEqual([ 'Cannot create resource. It is likely that the sinopia server is either not running or accepting requests.' ])
  })

  it('increments and sets the state with an update key to pass into child component to avoid infinite recursion', async () => {
    const wrapper = shallow(<ImportResourceTemplate />)
    const promise = Promise.resolve(mockResponse(201, "Created", result))
    const content = { Profile: { resourceTemplates: [ {propertyTemplates: {}} ]}}
    wrapper.instance().fulfillCreateResourcePromise(promise)
    wrapper.instance().setResourceTemplates(content, 'ld4p')
    expect(wrapper.state().updateKey).toBeGreaterThan(0)
  })
})
