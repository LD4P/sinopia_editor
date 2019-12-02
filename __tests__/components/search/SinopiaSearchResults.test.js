// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { renderWithRedux, createReduxStore, createBlankState } from 'testUtils'
import SinopiaSearchResults from 'components/search/SinopiaSearchResults'

describe('<SinopiaSearchResults />', () => {
  describe('when there are no search results', () => {
    const store = createReduxStore(createBlankState())

    const { container, queryByText } = renderWithRedux(
      <SinopiaSearchResults />,
      store,
    )

    it('does not contain the main div', () => {
      expect(container.querySelector('div#search-results')).not.toBeInTheDocument()
      expect(queryByText('Filter by class')).not.toBeInTheDocument()
    })
  })

  describe('when there are search results', () => {
    it('it contains the main div', () => {
      const state = createBlankState()
      state.selectorReducer.search.results = [{
        uri: 'https://trellis.sinopia.io/repository/stanford/some/path',
        type: ['http://schema.org/Thing'],
        label: 'An item title',
        modified: '2019-10-23T22:42:57.623Z',
        created: '2019-10-23T22:42:57.623Z',
      }]
      state.selectorReducer.search.facetResults = {
        types: [
          {
            key: 'http://schema.org/Thing',
            doc_count: 1,
          },
        ],
      }
      const store = createReduxStore(state)
      const { queryByText, getByText, container } = renderWithRedux(
        <SinopiaSearchResults />,
        store,
      )
      expect(container.querySelector('div#search-results')).toBeInTheDocument()
      expect(container.querySelector('table#search-results-list')).toBeInTheDocument()

      // Search table headers
      expect(queryByText('Label')).toBeInTheDocument()
      expect(queryByText('Class')).toBeInTheDocument()
      expect(queryByText('Institution')).toBeInTheDocument()
      expect(getByText('Modified', { selector: 'th' })).toBeInTheDocument()

      // It has a sort button
      expect(getByText('Sort by')).toBeInTheDocument()

      // It has a Filter by class
      expect(getByText('Filter by class')).toBeInTheDocument()

      // First row of search results
      expect(queryByText('An item title')).toBeInTheDocument()
      expect(queryByText('Oct 23, 2019')).toBeInTheDocument()
      expect(queryByText('http://schema.org/Thing')).toBeInTheDocument()
      expect(queryByText('Stanford University')).toBeInTheDocument()
    })
  })

  it('renders errors', () => {
    const state = createBlankState()
    state.selectorReducer.search.results = [{
      uri: 'http://platform:8080/repository/stanford/some/path',
      type: ['http://schema.org/Thing'],
      label: 'An item title',
      modified: '2019-10-23T22:42:57.623Z',
      created: '2019-10-23T22:42:57.623Z',
    }]
    state.selectorReducer.search.totalResults = 1
    state.selectorReducer.search.query = 'twain'
    state.selectorReducer.editor.errors.searchresource = ['Ooops']

    const store = createReduxStore(state)
    const { getByText } = renderWithRedux(
      <SinopiaSearchResults />, store,
    )
    expect(getByText('Ooops')).toBeInTheDocument()
  })
})
