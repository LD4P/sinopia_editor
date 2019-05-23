// Copyright 2018 Stanford University see Apache2.txt for license

import 'jsdom-global/register'
import React from 'react'
import { shallow, mount } from 'enzyme'
import ImportFileZone from '../../../src/components/editor/ImportFileZone'
import DropZone from 'react-dropzone'
import Config from '../../../src/Config'
require('isomorphic-fetch')
// NOTE: Your editor may bark at you about isomorphic-fetch being an extraneous require. Removing this line, however, causes test failures that look like the following:
//
// TypeError: err.indexOf is not a function
//
//                     })
//                     .catch(err => {
//                       if (err.indexOf('already exists') > 0)
//                               ^
//                         resolve()
//                       else
//                         reject(new Error(`error getting json schemas ${err}`))

describe('<ImportFileZone />', () => {
  it('has an upload button', () => {
    const wrapper = shallow(<ImportFileZone />)
    expect(wrapper.find('button#ImportProfile').exists()).toBeTruthy()
    expect(wrapper.find('button#ImportProfile').text()).toEqual('Import New or Revised Resource Template')
  })

  describe('schema valid', () => {
    describe('schema url in JSON', () => {
      const wrapper = shallow(<ImportFileZone />)
      let template, schemaUrl

      it('gets the schemaUrl from the resource-template', () => {
        template = require('../../__fixtures__/lcc_v0.2.0.json')
        schemaUrl = wrapper.instance().schemaUrl(template)
        expect(schemaUrl).toEqual('https://ld4p.github.io/sinopia/schemas/0.2.0/resource-template.json')
      })

      it('displays resource template passing validation', async () => {
        await wrapper.instance().promiseTemplateValidated(template, schemaUrl)
        expect(wrapper.state().validTemplate).toBeTruthy()
      })

      it('gets the schemaUrl from the profile', () => {
        template = require('../../__fixtures__/place_profile_v0.2.0.json')
        schemaUrl = wrapper.instance().schemaUrl(template)
        expect(schemaUrl).toEqual('https://ld4p.github.io/sinopia/schemas/0.2.0/profile.json')
      })

      it('displays profile passing validation', async () => {
        await wrapper.instance().promiseTemplateValidated(template, schemaUrl)
        expect(wrapper.state().validTemplate).toBeTruthy()
      })
    })

    describe('schema url not in JSON - default schemas used', () => {
      const wrapper = shallow(<ImportFileZone />)
      let template, schemaUrl

      it('gets the schemaUrl from the resource-template', () => {
        template = require('../../__fixtures__/lcc_v0.0.3_no_schema_specified.json')
        schemaUrl = wrapper.instance().schemaUrl(template)
        expect(schemaUrl).toEqual(`https://ld4p.github.io/sinopia/schemas/${Config.defaultProfileSchemaVersion}/resource-template.json`)
      })

      it('displays resource template passing validation', async () => {
        await wrapper.instance().promiseTemplateValidated(template, schemaUrl)
        expect(wrapper.state().validTemplate).toBeTruthy()
      })

      it('gets the schemaUrl from the profile', () => {
        template = require('../../__fixtures__/place_profile_v0.0.3_no_schema_specified.json')
        schemaUrl = wrapper.instance().schemaUrl(template)
        expect(schemaUrl).toEqual(`https://ld4p.github.io/sinopia/schemas/${Config.defaultProfileSchemaVersion}/profile.json`)
      })

      it('displays profile passing validation', async () => {
        await wrapper.instance().promiseTemplateValidated(template, schemaUrl)
        expect(wrapper.state().validTemplate).toBeTruthy()
      })
    })
  })

  describe('not schema valid', () => {
    const wrapper = shallow(<ImportFileZone />)
    let template, schemaUrl

    it('gets the schemaUrl from the resource-template', () => {
      template = require('../../__fixtures__/lcc_v0.2.0_invalid.json')
      schemaUrl = wrapper.instance().schemaUrl(template)
      expect(schemaUrl).toEqual('https://ld4p.github.io/sinopia/schemas/0.2.0/resource-template.json')
    })

    it('displays an error message when missing required property', async () => {
      await wrapper.instance().promiseTemplateValidated(template, schemaUrl).catch((err) => {
        expect(wrapper.state().validTemplate).toBeFalsy()
        expect(err.toString()).toMatch("should have required property")
      })
    })

    it('gets the schemaUrl from the resource-template', () => {
      template = require('../../__fixtures__/lcc_v0.2.0_bad_id.json')
      schemaUrl = wrapper.instance().schemaUrl(template)
      expect(schemaUrl).toEqual('https://ld4p.github.io/sinopia/schemas/0.2.0/resource-template.json')
    })

    it('displays an error message when the id is invalid', async () => {
      await wrapper.instance().promiseTemplateValidated(template, schemaUrl).catch((err) => {
        expect(wrapper.state().validTemplate).toBeFalsy()
        expect(err.toString()).toMatch('should match pattern')
      })
    })
  })

  describe('unfindable schema', () => {
    const wrapper = shallow(<ImportFileZone />)
    let template, schemaUrl

    it('gets the schemaUrl from the resource-template', () => {
      template = require('../../__fixtures__/edition_bad_schema.json')
      schemaUrl = wrapper.instance().schemaUrl(template)
      expect(schemaUrl).toEqual('https://ld4p.github.io/sinopia/schemas/not-there.json')
    })

    it('displays an error message', async () => {
      await wrapper.instance().promiseTemplateValidated(template, schemaUrl).catch((err) => {
        expect(wrapper.state().validTemplate).toBeFalsy()
        expect(err.toString()).toMatch("Error: error getting json schemas")
      })
    })
  })
})

describe('<DropZone />', () => {
  const wrapper = mount(<ImportFileZone />)

  it('shows the dropzone div when button is clicked', () => {
    wrapper.setState({showDropZone: false})
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.find('DropZone > section > strong').last().text())
      .toMatch('Drag and drop a resource template file in the box')
    expect(wrapper.find('DropZone > section > strong').last().text())
      .toMatch('or click it to select a file to upload:')
  })

  it('hides the dropzone div when button is clicked again', () => {
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.find('DropZone > section > p').exists()).toBeFalsy()
  })

  it('hides the dropzone div when the file dialog is canceled', () => {
    wrapper.setState({showDropZone: false})
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.state('showDropZone')).toBeTruthy()
    wrapper.setState({showDropZone: false})
    expect(wrapper.state('showDropZone')).toBeFalsy()
  })

  it('hides the dropzone div when the resource template menu link is clicked', () => {
    wrapper.setState({showDropZone: false})
    wrapper.find('button.btn').simulate('click')
    expect(wrapper.state('showDropZone')).toBeTruthy()
    wrapper.instance().handleClick()
    wrapper.setState({showDropZone: false})
    expect(wrapper.state('showDropZone')).toBeFalsy()
  })

  it('disallows multi-file uploads', () => {
    wrapper.setState({showDropZone: true})
    expect(wrapper.find(DropZone).instance().props.multiple).toEqual(false)
  })

  describe('simulating a file drop calls the file reading functions', () => {
    // NOTE: This is for code coverage only;  there are no expect statements
    // Dropzone throws an error when performing a drop simulate on the input.
    it('lets you input a selected file', () => {
      console.error = jest.fn()
      wrapper.setState({showDropZone: true})
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
