// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import InputLang from 'components/editor/property/InputLang'

const plProps = {
  propertyTemplate: {
    propertyLabel: 'Instance of',
    propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
    type: 'literal',
  },
  loadLanguages: jest.fn(),
  options: [],
  reduxPath: [],
  textValue: 'test1',
}

describe('<InputLang />', () => {
  const mockLangChangeFn = jest.fn()
  const wrapper = shallow(<InputLang.WrappedComponent {...plProps}
                                                      handleLangChange={mockLangChangeFn} />)

  it('contains a label with the value of propertyLabel', () => {
    const expected = 'Select language for test1'

    expect(wrapper.find('label').text()).toEqual(
      expect.stringContaining(expected),
    )
  })

  it('typeahead component uses selectHintOnEnter', () => {
    expect(wrapper.find('#langComponent').props().selectHintOnEnter).toEqual(true)
  })

  it('calls the handleLangChange on change', () => {
    wrapper.find('#langComponent').simulate('change', [{ id: 'en', label: 'English' }])
    expect(mockLangChangeFn).toHaveBeenCalled()
  })
})
