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
      expect(wrapper.find('Pagination').length).toBe(1)
      expect(wrapper.find('First').length).toBe(1)
      expect(wrapper.find('Prev').length).toBe(1)
      expect(wrapper.find('PaginationItem').length).toBe(10)
      expect(wrapper.find('Next').length).toBe(1)
      expect(wrapper.find('Last').length).toBe(1)
    })
  })
})
