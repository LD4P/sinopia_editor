// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'
import FormWrapper from '../../../src/components/editor/FormWrapper'

const rtProps = {
  "propertyTemplates": [
    [{
      "propertyLabel": "Instance of",
      "type": "literal"
    }],
    [{
      "propertyLabel": "Instance of",
      "type": "lookup"
    }],
    [{
      "propertyLabel": "Instance of",
      "type": "resource"
    }]
  ]
}


describe('<FormWrapper />', () => {
  const wrapper = shallow(<FormWrapper {...rtProps} />)
  it('renders the FormWrapper text nodes', () => {
    wrapper.find('div.FormWrapper > p').forEach((node) => {
      expect(node.containsAnyMatchingElements([
        'BEGIN FormWrapper',
        'END FormWrapper'
      ]))
    })
  })

  it('renders FormWrapper nested component', () => {
    expect(wrapper
      .find('div.FormWrapper > div > InputLiteral').length)
      .toEqual(1)
  })

  it('<form> does not contain redundant form attribute', () => {
    expect(wrapper.find('form[role="form"]').length).toEqual(0)
  })

})
