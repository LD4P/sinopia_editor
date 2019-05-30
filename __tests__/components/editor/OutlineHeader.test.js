// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import OutlineHeader from '../../../src/components/editor/OutlineHeader'
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import PropertyLabel from '../../../src/components/editor/PropertyLabel'

describe('<OutlineHeader />', () => {
  const property = {
    "propertyLabel": "Instance of",
    "propertyURI": "http://id.loc.gov/ontologies/bibframe/instanceOf",
    "mandatory": "false"
  }

  let headerProps = {
    spacer: 0,
    collapsed: true,
    pt: property
  }
  const wrapper = shallow(<OutlineHeader {...headerProps} />)

  it('contains a FontAwesomeIcon', () => {
    expect(wrapper.find(FontAwesomeIcon)).toBeTruthy()
  })

  it('contains a <PropertyLabel />', () => {
    expect(wrapper.find(PropertyLabel)).toBeTruthy()
  })

  it('anchor is plus when collapsed', () => {
    const faWrapper = wrapper.find('[icon]')
    expect(faWrapper.getElement(0).props.icon).toEqual(faPlusSquare)
  })

  it('anchor is minus when expanded', () => {
    let expandedProps = Object.assign({}, headerProps)
    expandedProps.collapsed = false
    const expWrapper = shallow(<OutlineHeader {...expandedProps} />)
    const faWrapper = expWrapper.find('[icon]')
    expect(faWrapper.getElement(0).props.icon).toEqual(faMinusSquare)
  })
})
