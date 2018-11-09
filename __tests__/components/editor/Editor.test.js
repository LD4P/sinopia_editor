import React from 'react'
import { shallow } from 'enzyme'
import Editor from '../../../src/components/editor/Editor'
import ResourceTemplate from '../../../src/components/editor/ResourceTemplate'
import Footer from '../../../src/components/Footer'

describe('<Editor />', () => {
  const wrapper = shallow(<Editor />)
  it('has div with id "editor"', () => {
    expect(wrapper.find('div#editor').length).toBe(1)
  })

  it('renders <ResourceTemplate /> component', () => {
    expect(wrapper.find(ResourceTemplate).length).toBe(1)
  })

  it('renders <Footer />', () => {
    expect(wrapper.find(Footer).length).toBe(1)
  })
})
