// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import SearchResultsMessage from 'components/search/SearchResultsMessage'

describe('<SearchResultsMessage />', () => {
  describe('before a search is executed', () => {
    const props = {
      query: undefined,
    }

    const wrapper = shallow(<SearchResultsMessage.WrappedComponent {...props} />)

    it('does not contain the message div', () => {
      expect(wrapper.find('div#search-results-message').length).toBe(0)
    })
  })

  describe('when there are no search results from a successful fetch', () => {
    const props = {
      query: '*',
      totalResults: 0,
    }

    const wrapper = shallow(<SearchResultsMessage.WrappedComponent {...props} />)

    it('does displays a zero result message', () => {
      expect(wrapper.find('div#search-results-message').length).toBe(1)
      expect(wrapper.text().includes('Displaying 0 Search Results')).toBe(true)
    })
  })

  describe('when there are 100 search results', () => {
    const props = {
      query: '*',
      totalResults: 100,
      startOfRange: 0,
      resultsPerPage: 10,
    }

    const wrapper = shallow(<SearchResultsMessage.WrappedComponent {...props} />)

    it('does displays a search result message', () => {
      expect(wrapper.find('div#search-results-message').length).toBe(1)
      expect(wrapper.text().includes('Displaying 1 - 10 of 100')).toBe(true)
    })
  })
})
