// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import OutlineHeader from '../../../src/components/editor/OutlineHeader'
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

describe('<OutlineHeader />', () => {
  let headerProps = {
    spacer: 0,
    label: "Schema Thing",
    collapsed: true,
    isRequired: false
  }
  const wrapper = shallow(<OutlineHeader {...headerProps} />)

  it('Contains a FontAwesomeIcon and label value from props', () => {
    expect(wrapper.find("div").text()).toEqual(` <FontAwesomeIcon /> ${headerProps.label}`)
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
