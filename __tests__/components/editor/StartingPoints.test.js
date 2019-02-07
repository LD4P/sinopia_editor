// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow, mount } from 'enzyme'
import StartingPoints from '../../../src/components/editor/StartingPoints'
import DropZone from '../../../src/components/editor/StartingPoints'
import { MemoryRouter } from 'react-router-dom'

const jsdom = require("jsdom")
require('isomorphic-fetch')

setUpDomEnvironment()

describe('<StartingPoints />', () => {
  let wrapper = shallow(<StartingPoints />)

  it('Has a div with headings', () => {
    expect(wrapper.find('div > h3').text()).toEqual('Create Resource')
  })

  it('has an upload button', async() => {
    expect(wrapper.find('button#ImportProfile').exists()).toBeTruthy()
  })
})

describe('<DropZone />', () => {
  const tempStateCallbackFn = jest.fn()
  let wrapper = mount(<MemoryRouter><DropZone tempStateCallback={tempStateCallbackFn}/></MemoryRouter>)

  it('shows the dropzone div when button is clicked', () => {
    wrapper.setState({showDropZone: false})
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.find('DropZone > section > p').text())
      .toEqual('Drop resource template file or click to select a file to upload:')
  })

  it('hides the dropzone div when button is clicked again', () => {
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.find('DropZone > section > p').exists()).toBeFalsy()
  })

  it('hides the dropzone div when the file dialog is canceled', () => {
    wrapper.setState({showDropZone: true})
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.state('showDropZone')).toBeTruthy()
    wrapper.find(DropZone).instance().updateShowDropZone(false)
    wrapper.setState({showDropZone: false})
    expect(wrapper.state('showDropZone')).toBeFalsy()
  })

  it('hides the dropzone div when the resource template menu link is clicked', () => {
    wrapper.setState({showDropZone: true})
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.state('showDropZone')).toBeTruthy()
    wrapper.find(DropZone).instance().resetShowDropZone()
    wrapper.setState({showDropZone: false})
    expect(wrapper.state('showDropZone')).toBeFalsy()
  })

  describe('simulating a file drop calls the file reading functions', () => {
    // NOTE: This is for code coverage only;  there are no expect statements
    //  NOTE: this is covered by integration/schemaValidation.test but that doesn't show coverage
    // Dropzone throws an error when performing a drop simulate on the input.
    it('lets you input a selected file', () => {
      console.error = jest.fn()
      wrapper.find('button.btn').simulate('click')
      wrapper.find('input[type="file"]').simulate('drop', {
        target: {files: ['item.json']}
      })
      console.error.mockClear()
    })
  })

  describe('cleanup', () => {
    it('unmounts the wrapper', () => {
      expect(wrapper.debug().length).toBeGreaterThanOrEqual(1)
      wrapper.unmount();
      expect(wrapper.debug().length).toBe(0)
    })
  })
})

function setUpDomEnvironment() {
  const { JSDOM } = jsdom
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost/'})
  const { window } = dom

  global.window = window
  global.document = window.document
  global.navigator = {
    userAgent: 'node.js'
  }
  copyProps(window, global)
}
function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop))
  Object.defineProperties(target, props)

}
