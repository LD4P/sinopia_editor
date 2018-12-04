// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow, mount } from 'enzyme'
import StartingPoints from '../../../src/components/editor/StartingPoints'
import DropZone from '../../../src/components/editor/StartingPoints'

const jsdom = require("jsdom");

setUpDomEnvironment();

describe('<StartingPoints />', () => {
  let wrapper = shallow(<StartingPoints />)

  it('Has a div with headings', () => {
    expect(wrapper.find('div > h3').text()).toEqual('Create Resource')
  })
})

describe('<DropZone />', () => {
  let wrapper = mount(<DropZone />)

  it('shows the dropzone div when button is clicked', () => {
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.find('DropZone > section > p').text()).toEqual('Drop profile files here or click to select a file:')
  })

  it('hides the dropzone div when button is clicked again', () => {
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.find('DropZone > section > p').exists()).toBeFalsy()
  })

  it('hides the dropzone div when the file dialog is canceled', () => {
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.state('showDropZone')).toBeTruthy()
    wrapper.instance().updateShowDropZone(false)
    expect(wrapper.state('showDropZone')).toBeFalsy()
  })

  it('sets the state to include the selected file', () => {
    wrapper.find('button.btn').simulate('click')
    wrapper.find('input[type="file"]').simulate('drop')
    expect(wrapper.state('files')).toBeDefined()
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
  const { JSDOM } = jsdom;
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost/'});
  const { window } = dom;

  global.window = window;
  global.document = window.document;
  global.navigator = {
    userAgent: 'node.js',
  };
  copyProps(window, global);
}
function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}
