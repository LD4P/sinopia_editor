// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import OutlineHeader from 'components/editor/property/OutlineHeader'

describe('<OutlineHeader />', () => {
  const property = {
    propertyLabel: 'Instance of',
    propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
    mandatory: 'false',
  }

  describe('collapsed and not added', () => {
    const mockHandleAddAndOpen = jest.fn()

    const headerProps = {
      collapsed: true,
      resourceModel: {},
      handleAddAndOpen: mockHandleAddAndOpen,
      property,
    }
    const wrapper = shallow(<OutlineHeader.WrappedComponent {...headerProps} />)

    it('contains a <PropertyLabel />', () => {
      expect(wrapper.exists('PropertyLabel')).toEqual(true)
    })

    it('expand button is plus and disabled', () => {
      expect(wrapper.exists('button.btn-toggle[disabled=true]')).toEqual(true)
      expect(wrapper.find('FontAwesomeIcon').props().icon).toEqual(faPlusSquare)
    })

    describe('add button', () => {
      it('has an add button', () => {
        expect(wrapper.exists('button.btn-add')).toEqual(true)
      })

      it('calls handleAddAndOpen when clicked', () => {
        wrapper.find('button.btn-add').simulate('click')
        expect(mockHandleAddAndOpen).toHaveBeenCalledTimes(1)
      })
    })

    it('does not have a remove button', () => {
      expect(wrapper.exists('button.btn-remove')).toEqual(false)
    })
  })

  describe('collapsed and added', () => {
    const mockHandleRemoveButton = jest.fn()
    const mockHandleAddAndOpen = jest.fn()

    const headerProps = {
      collapsed: true,
      resourceModel: { abc123: { 'resourceTemplate:bf2:Title:Note': {} } },
      handleRemoveButton: mockHandleRemoveButton,
      handleAddAndOpen: mockHandleAddAndOpen,
      property,
    }
    const wrapper = shallow(<OutlineHeader.WrappedComponent {...headerProps} />)

    describe('expand button', () => {
      it('is plus', () => {
        expect(wrapper.find('FontAwesomeIcon').props().icon).toEqual(faPlusSquare)
      })

      it('is not disabled', () => {
        expect(wrapper.exists('button.btn-toggle[disabled=false]')).toEqual(true)
      })

      it('calls handleAddAndOpen when clicked', () => {
        wrapper.find('button.btn-toggle').simulate('click')
        expect(mockHandleAddAndOpen).toHaveBeenCalledTimes(1)
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

    it('expand button is minus and not disabled', () => {
      expect(wrapper.exists('button.btn-toggle[disabled=false]')).toEqual(true)
      expect(wrapper.find('FontAwesomeIcon').props().icon).toEqual(faMinusSquare)
    })

    it('does not have an add button', () => {
      expect(wrapper.exists('button.btn-add')).toEqual(false)
    })

    it('has a remove button', () => {
      expect(wrapper.exists('button.btn-remove')).toEqual(true)
    })
  })
})
