// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import Editor from '../../../src/components/editor/Editor'
import ResourceTemplate from '../../../src/components/editor/ResourceTemplate'
import Header from '../../../src/components/editor/Header'

describe('<Editor />', () => {
  const wrapper = shallow(<Editor />)
  it('has div with id "editor"', () => {
    expect(wrapper.find('div#editor').length).toBe(1)
  })

  it('renders <ResourceTemplate /> component', () => {
    expect(wrapper.find(ResourceTemplate).length).toBe(1)
  })

  it('renders <Header />', () => {
    expect(wrapper.find(Header).length).toBe(1)
  })
})
