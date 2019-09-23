// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyLabelInfoLink from 'components/editor/property/PropertyLabelInfoLink'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'


describe('<PropertyLabelInfoLink />', () => {
  const props = {
    propertyTemplate: {
      remark: 'http://access.rdatoolkit.org/example',
      propertyLabel: 'Example RDA',
    },
  }
  const wrapper = shallow(<PropertyLabelInfoLink {...props} />)

  it('displays an HTML anchor tag', () => {
    expect(wrapper.find('a')).toBeTruthy()
  })

  it('contains a href with the value of the remark', () => {
    const anchor = wrapper.find('a')

    expect(anchor.prop('href')).toEqual(new URL('http://access.rdatoolkit.org/example'))
  })

  it('renders an info icon', () => {
    expect(wrapper.find('FontAwesomeIcon').props().icon).toEqual(faExternalLinkAlt)
  })
})
