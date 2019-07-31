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
  textValue: 'test1',
  reduxPath: [],
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

  it('typeahead component should use selectHintOnEnter', () => {
    expect(wrapper.find('#langComponent').props().selectHintOnEnter).toBeTruthy()
  })

  it('should call the handleLangChange on change', () => {
    wrapper.find('#langComponent').simulate('change', [{ id: 'en', label: 'English' }])
    expect(mockLangChangeFn.call.length).toBe(1)
  })

  it('should call the onFocus event and set the selected option', () => {
    const opts = { id: 'URI', label: 'LABEL', uri: 'URI' }

    wrapper.instance().opts = opts
    const event = (wrap) => {
      global.fetch = jest.fn().mockImplementation(async () => await { ok: true, resp: wrapper.instance().opts })
      wrap.setState({ options: [wrapper.instance().opts] })
      wrap.setState({ selected: [wrapper.instance().opts] })
    }

    wrapper.find('#langComponent').simulate('focus', event(wrapper))
    expect(wrapper.state().options[0]).toEqual(opts)
    expect(wrapper.find('TypeaheadContainer(WrappedTypeahead)').props().emptyLabel).toEqual('retrieving list of languages...')

    wrapper.find('#langComponent').simulate('change', [{ id: 'en', label: 'English' }])
    expect(wrapper.state().selected[0]).toEqual(opts)

    wrapper.find('#langComponent').simulate('blur', event(wrapper))
    expect(wrapper.state('isLoading')).toBeFalsy()
  })
})
