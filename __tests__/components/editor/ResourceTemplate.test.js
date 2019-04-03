// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import ResourceTemplate from '../../../src/components/editor/ResourceTemplate'
import ResourceTemplateForm from '../../../src/components/editor/ResourceTemplateForm'

describe('<ResourceTemplate />', () => {
  const mockHandleResourceTemplate = jest.fn()
  const wrapper = shallow(<ResourceTemplate.WrappedComponent
    resourceTemplateId='resourceTemplate:bf2:Monograph:Instance'
    handleResourceTemplate={mockHandleResourceTemplate} />)
	it('shows resource title', () => {
	  expect(wrapper.find('section > h1').text()).toMatch('[Clone|Edit] BIBFRAME Instance')
	})

  it('has div with class "ResourceTemplate"', () => {
    expect(wrapper.find('div.ResourceTemplate').length).toEqual(1)
  })

  // TODO: if we have more than one resourceTemplate form, they need to have unique ids (see #130)
  it('contains <div> with id resourceTemplate', () => {
    expect(wrapper.find('div#resourceTemplate').length).toEqual(1)
  })

  it('renders ResourceTemplateForm', () => {
    expect(wrapper.find(ResourceTemplateForm).length).toEqual(1)
  })
})
