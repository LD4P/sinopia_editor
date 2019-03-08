// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'

import PropertyTypeRow from '../../../src/components/editor/PropertyTypeRow'

describe('<PropertyTypeRow />', () => {
  const rowProps = {
    propertyTemplate: {
      propertyLabel: 'This is a property label'
    }
  }
  const wrapper = shallow(<PropertyTypeRow {...rowProps} />)

  it('displays propertyLabel from props', () => {
    expect(wrapper.find(`${rowProps.propertyTemplate.propertyLabel}`)).toBeTruthy()
  })
})
