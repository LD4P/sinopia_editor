// Copyright 2019 Stanford University see LICENSE for license

import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import UpdateResourceModal from 'components/templates/UpdateResourceModal'

describe('<UpdateResourceModal> with conflict message', () => {
  const messages = [{
    req: {
      method: 'POST',
      url: 'http://localhost:8080/repository/ld4p',
      _data: {
        propertyTemplates: [
          {
            mandatory: 'true',
            repeatable: 'false',
            type: 'literal',
            propertyURI: 'http://id.loc.gov/ontologies/bibframe/classificationPortion',
            propertyLabel: 'LC Classification Number 2',
          },
        ],
        id: 'sinopia:resourceTemplate:bf2:LCC',
        resourceLabel: 'Library of Congress Classification 2',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/ClassificationLcc',
        date: '2019-04-19',
        author: 'NDMSO',
        schema: 'https://ld4p.github.io/sinopia/schemas/0.1.0/resource-template.json',
      },
    },
    statusText: 'Conflict',
    statusCode: 409,
    status: 409,
  }]

  const mockUpdate = jest.fn()
  const mockClose = jest.fn()
  const wrapper = shallow(<UpdateResourceModal show={true} close={mockClose} messages={messages} update={mockUpdate} />)

  wrapper.update()

  it('renders the component as a Modal', () => {
    expect(wrapper.find(Modal).length).toBe(1)
  })

  it('has a modal title with the status text and template id', () => {
    expect(wrapper.find(Modal.Title).dive().text()).toEqual('sinopia:resourceTemplate:bf2:LCC already exists')
  })

  it('has a modal body with a question', () => {
    expect(wrapper.find(Modal.Body).dive().text()).toEqual('Do you want to overwrite these resource templates?')
  })

  it('has a Yes button, when clicked will call the update function', () => {
    const button = wrapper.find(Button).first()

    expect(button.dive().text()).toEqual('Yes, overwrite')
    button.simulate('click')
    expect(mockUpdate).toHaveBeenCalled()
  })

  it('has a No button, when clicked will call the modal close function', () => {
    const button = wrapper.find(Button).last()

    expect(button.dive().text()).toEqual('No, get me out of here!')
    button.simulate('click')
    expect(mockClose).toHaveBeenCalled()
  })
})

describe('message with no data (or id)', () => {
  const messages = [{
    req: {
      method: 'POST',
      url: 'http://localhost:8080/repository/ld4p',
      _data: {},
    },
    statusText: 'Conflict',
    statusCode: 409,
    status: 409,
  }]

  const mockUpdate = jest.fn()
  const mockClose = jest.fn()
  const wrapper = shallow(<UpdateResourceModal show={true} close={mockClose} messages={messages} update={mockUpdate} />)

  wrapper.update()

  expect(wrapper.state().titleMessage).toEqual('')
  expect(wrapper.state().group).toEqual('')
  expect(wrapper.state().rts).toEqual([])
})
