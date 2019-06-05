// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import OutlineHeader from 'components/editor/property/OutlineHeader'
import PropertyLabel from 'components/editor/property/PropertyLabel'

describe('<OutlineHeader />', () => {
  const property = {
    propertyLabel: 'Instance of',
    propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
    mandatory: 'false',
  }
  const headerProps = {
    spacer: 0,
    collapsed: true,
    pt: property,
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
    const expandedProps = { ...headerProps }

    expandedProps.collapsed = false
    const expWrapper = shallow(<OutlineHeader {...expandedProps} />)
    const faWrapper = expWrapper.find('[icon]')

    expect(faWrapper.getElement(0).props.icon).toEqual(faMinusSquare)
  })
})
