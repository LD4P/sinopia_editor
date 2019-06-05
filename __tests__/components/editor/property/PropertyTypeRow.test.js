// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'

import PropertyTypeRow from 'components/editor/property/PropertyTypeRow'

describe('<PropertyTypeRow />', () => {
  const rowProps = {
    propertyTemplate: {
      propertyLabel: 'This is a property label',
    },
  }
  const wrapper = shallow(<PropertyTypeRow {...rowProps} />)

  it('displays propertyLabel from props', () => {
    expect(wrapper.find(`${rowProps.propertyTemplate.propertyLabel}`)).toBeTruthy()
  })
})
