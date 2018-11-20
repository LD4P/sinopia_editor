// Copyright 2018 Stanford University see Apache2.txt for license
import React from 'react'
import { shallow } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'

const plProps = {
  "propertyTemplate": 
    {
      "propertyLabel": "Instance of",
      "type": "literal"
    }
}

describe('<InputLiteral />', () => {
  const wrapper = shallow(<InputLiteral {...plProps} />)
  
  it('contains a label with "Instance of"', () => {
    expect(wrapper.find('label').text()).toBe('Instance of')
  })
  it('<input> element should have a placeholder attribute with value propertyLabel', () => {
    expect(wrapper.find('input').props().placeholder).toBe('Instance of')
  })

})