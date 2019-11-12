// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import OutlineHeader from 'components/editor/property/OutlineHeader'

describe('<OutlineHeader />', () => {
  const property = {
    propertyLabel: 'Instance of',
    propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
    mandatory: 'false',
  }

  describe('collapsed and not added', () => {
    const mockHandleAddButton = jest.fn()

    const headerProps = {
      collapsed: true,
      resourceModel: {},
      handleAddButton: mockHandleAddButton,
      property,
    }
    const wrapper = shallow(<OutlineHeader.WrappedComponent {...headerProps} />)

    it('contains a <PropertyLabelInfo />', () => {
      expect(wrapper.exists('PropertyLabelInfo')).toEqual(true)
    })

    describe('add button', () => {
      it('has an add button', () => {
        expect(wrapper.exists('button.btn-add')).toEqual(true)
        expect(wrapper.find('button.btn-add').text()).toEqual('+ Add')
      })

      it('calls handleAddButton when clicked', () => {
        wrapper.find('button.btn-add').simulate('click')
        expect(mockHandleAddButton).toHaveBeenCalledTimes(1)
      })
    })

    it('does not have a remove button', () => {
      expect(wrapper.exists('button.btn-remove')).toEqual(false)
    })

    describe('Errors', () => {
      const errors = ['Required']
      const wrapper = shallow(<OutlineHeader.WrappedComponent displayValidations={true} errors={errors} {...headerProps}/>)

      it('displays the errors', () => {
        expect(wrapper.find('span.text-danger').text()).toEqual('Required')
      })

      it('sets the has-error class', () => {
        expect(wrapper.exists('div.has-error')).toEqual(true)
      })
    })
  })

  describe('collapsed and added', () => {
    const mockHandleToggle = jest.fn()
    const mockHandleRemoveButton = jest.fn()

    const headerProps = {
      collapsed: true,
      resourceModel: { abc123: { 'resourceTemplate:bf2:Title:Note': {} } },
      handleToggle: mockHandleToggle,
      handleRemoveButton: mockHandleRemoveButton,
      property,
    }
    const wrapper = shallow(<OutlineHeader.WrappedComponent {...headerProps} />)

    describe('expand button', () => {
      it('is plus', () => {
        expect(wrapper.find('FontAwesomeIcon#toggle-icon').props().icon).toEqual(faAngleRight)
      })

      it('is not disabled', () => {
        expect(wrapper.exists('button.btn-toggle[disabled=false]')).toEqual(true)
      })

      it('calls handleAddAndOpen when clicked', () => {
        wrapper.find('button.btn-toggle').simulate('click')
        expect(mockHandleToggle).toHaveBeenCalledTimes(1)
      })
    })


    it('does not have an add button', () => {
      expect(wrapper.exists('button.btn-add')).toEqual(false)
    })

    describe('remove button', () => {
      it('has an remove button', () => {
        expect(wrapper.exists('button.btn-remove')).toEqual(true)
      })

      it('calls handleRemoveButton when clicked', () => {
        wrapper.find('button.btn-remove').simulate('click')
        expect(mockHandleRemoveButton).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('expanded and added', () => {
    const headerProps = {
      collapsed: false,
      resourceModel: { abc123: { 'resourceTemplate:bf2:Title:Note': {} } },
      property,
    }
    const wrapper = shallow(<OutlineHeader.WrappedComponent {...headerProps} />)

    it('expand button is angle down and not disabled', () => {
      expect(wrapper.exists('button.btn-toggle[disabled=false]')).toEqual(true)
      expect(wrapper.find('FontAwesomeIcon#toggle-icon').props().icon).toEqual(faAngleDown)
    })

    it('does not have an add button', () => {
      expect(wrapper.exists('button.btn-add')).toEqual(false)
    })

    it('has a remove button', () => {
      expect(wrapper.exists('button.btn-remove')).toEqual(true)
    })
  })
})
