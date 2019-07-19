// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import SearchResults from 'components/search/SearchResults'

describe('<SearchResults />', () => {
  describe('when there are no search results', () => {
    const props = {
      searchResults: [],
    }

    const wrapper = shallow(<SearchResults.WrappedComponent {...props} />)

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

    const wrapper = shallow(<SearchResults.WrappedComponent {...props} />)

    it('it contains the main div', () => {
      expect(wrapper.find('div#search-results').length).toBe(1)
      expect(wrapper.find('BootstrapTableContainer').length).toBe(1)
    })
  })
})
