// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import SearchResultsPaging from 'components/search/SearchResultsPaging'

describe('<SearchResultsPaging />', () => {
  describe('when there are no search results', () => {
    const props = {
      totalResults: 0,
    }

    const wrapper = shallow(<SearchResultsPaging.WrappedComponent {...props} />)

    it('does not contain the paging div', () => {
      expect(wrapper.find('div#search-results-pages').length).toBe(0)
    })
  })


  describe('when there are search results', () => {
    const props = {
      totalResults: 100,
    }

    const wrapper = shallow(<SearchResultsPaging.WrappedComponent {...props} />)

    it('it contains the main paging div', () => {
      expect(wrapper.find('div#search-results-pages').length).toBe(1)
      expect(wrapper.find('ul.pagination').length).toBe(1)
      const listItems = wrapper.find('li.page-item')
      expect(listItems.at(0).text()).toBe('«')
      expect(listItems.at(1).text()).toBe('‹')
      expect(listItems.length).toBe(14)
      expect(listItems.at(12).text()).toBe('›')
      expect(listItems.at(13).text()).toBe('»')
    })
  })
})
