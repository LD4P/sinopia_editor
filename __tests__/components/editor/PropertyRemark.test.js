// Copyright 2019 Stanford University see Apache2.txt for license
import React from 'react'
import { shallow } from 'enzyme'
import PropertyRemark from '../../../src/components/editor/PropertyRemark'

describe('<PropertyRemark />', () => {
  const wrapper = shallow(<PropertyRemark remark="http://access.rdatoolkit.org/example"
      label="Example RDA" />)

  it('displays an HTML anchor tag', () => {
    expect(wrapper.find('a')).toBeTruthy()
  })

  it('contains a href with the value of the remark', () => {
    const anchor = wrapper.find('a')
    expect(anchor.prop('href')).toEqual("http://access.rdatoolkit.org/example")
  })

  it('contains a span with the value of the label', () => {
    const span = wrapper.find('a > span')
    expect(span.text()).toEqual("Example RDA")
  })
})
