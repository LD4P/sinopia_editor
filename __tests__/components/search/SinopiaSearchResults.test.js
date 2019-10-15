// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import SinopiaSearchResults from 'components/search/SinopiaSearchResults'

describe('<SinopiaSearchResults />', () => {
  describe('when there are no search results', () => {
    const props = {
      searchResults: [],
    }

    const wrapper = shallow(<SinopiaSearchResults.WrappedComponent {...props} />)

    it('does not contain the main div', () => {
      expect(wrapper.find('div#search-results').length).toBe(0)
    })
  })


  describe('when there are search results', () => {
    const props = {
      searchResults: [{
        uri: '/some/example/path',
        title: 'An item title',
      }],
    }

    const wrapper = shallow(<SinopiaSearchResults.WrappedComponent {...props} />)

    it('it contains the main div', () => {
      expect(wrapper.find('div#search-results').length).toBe(1)
      expect(wrapper.find('table#search-results-list').length).toBe(1)
    })
  })
})
