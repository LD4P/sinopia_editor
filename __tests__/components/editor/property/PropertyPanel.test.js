// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyPanel from 'components/editor/property/PropertyPanel'
import PropertyLabel from 'components/editor/property/PropertyLabel'

describe('<PropertyPanel />', () => {
  const panelProps = {
    propertyTemplate: {
      propertyLabel: 'Instance of',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
      resourceTemplates: [],
      type: 'resource',
      valueConstraint: {
        valueTemplateRefs: [
          'resourceTemplate:bf2:Monograph:Work',
        ],
        useValuesFrom: [],
        valueDataType: {},
        defaults: [],
      },
      mandatory: 'true',
      repeatable: 'true',
    },
    reduxPath: ['resource', 'resourceTemplate:bf2:Monograph:Instance', 'http://id.loc.gov/ontologies/bibframe/instanceOf'],
  }

  const wrapper = shallow(<PropertyPanel {...panelProps} />)

  it('Contains a panel-header and panel-body divs', () => {
    expect(wrapper.find('.panel-header')).toBeTruthy()
    expect(wrapper.find('.panel-body')).toBeTruthy()
  })

  it('generates a <PropertyLabel />', () => {
    expect(wrapper.find(PropertyLabel)).toBeTruthy()
  })

  describe('when resource model is empty', () => {
    const wrapper = shallow(<PropertyPanel.WrappedComponent resourceModel={{}} {...panelProps} />)
    it('renders Add button', () => {
      expect(wrapper.exists('button.btn-add')).toBeTruthy()
    })
    it('does not render Remove button', () => {
      expect(wrapper.exists('button.btn-remove')).toBeFalsy()
    })
  })
  describe('when resource model is not empty', () => {
    const notMandatoryPanelProps = { ...panelProps }
    panelProps.propertyTemplate.mandatory = 'false'
    const wrapper = shallow(<PropertyPanel.WrappedComponent resourceModel={{ items: [] }} {...notMandatoryPanelProps} />)
    it('renders Remove button', () => {
      expect(wrapper.exists('button.btn-remove')).toBeTruthy()
    })
    it('does not render Add button', () => {
      expect(wrapper.exists('button.btn-add')).toBeFalsy()
    })
  })
  describe('when resource model is not empty and property is mandatory', () => {
    it('does not render Remove button', () => {
      expect(wrapper.exists('button.btn-remove')).toBeFalsy()
    })
    it('does not render Add button', () => {
      expect(wrapper.exists('button.btn-add')).toBeFalsy()
    })
  })
})
