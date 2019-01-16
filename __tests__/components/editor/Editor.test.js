// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import Editor from '../../../src/components/editor/Editor'
import StartingPoints from '../../../src/components/editor/StartingPoints'
import ResourceTemplate from '../../../src/components/editor/ResourceTemplate'
import Header from '../../../src/components/editor/Header'

const props = {
  location: { state: {rtId: 'resourceTemplate:bf:Note'}}
}

describe('<Editor />', () => {
  const handleGenerateLDFn = jest.fn()
  const wrapper = shallow(<Editor.WrappedComponent {...props} handleGenerateLD={handleGenerateLDFn}/>)
  it('has div with id "editor"', () => {
    expect(wrapper.find('div#editor').length).toBe(1)
  })

  it('renders <ResourceTemplate /> component', () => {
    expect(wrapper.find(ResourceTemplate).length).toBe(1)
  })

  it('renders <StartingPoints /> component', () => {
    expect(wrapper.find(StartingPoints).length).toBe(1)
  })

  it('renders <Header />', () => {
    expect(wrapper.find(Header).length).toBe(1)
  })

  it('shows resource title', () => {
    expect(wrapper.find('div#editor > h1').text()).toMatch('[Clone|Edit] title.of.resource')
  })

  it('resets the state and resource template when updated', () => {
    wrapper.instance().componentDidUpdate(props)
    expect(wrapper.state('tempRtState')).toBeFalsy()
    expect(wrapper.state('resourceTemplateData').length).toBeGreaterThanOrEqual(1)
  })
  
})
