// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { renderWithRedux, createReduxStore } from 'testUtils'
import SinopiaSearchResults from 'components/search/SinopiaSearchResults'

describe('<SinopiaSearchResults />', () => {
  const state = {
    selectorReducer: {
      editor: {
        errors: {},
      },
      resource: {},
      search: {
        results: [],
      },
    },
  }

  describe('when there are no search results', () => {
    const store = createReduxStore(state)

    const { container } = renderWithRedux(
      <SinopiaSearchResults />,
      store,
    )


    it('does not contain the main div', () => {
      expect(container.querySelector('div#search-results')).not.toBeInTheDocument()
    })
  })


  describe('when there are search results', () => {
    it('it contains the main div', () => {
      state.selectorReducer.search.results.push({
        uri: 'some/stanford/path',
        type: ['http://schema.org/Thing'],
        label: 'An item title',
        modified: '2019-10-23T22:42:57.623Z',
        created: '2019-10-23T22:42:57.623Z',
      })
      const store = createReduxStore(state)
      const { queryByText, getByText, container } = renderWithRedux(
        <SinopiaSearchResults />,
        store,
      )
      expect(container.querySelector('div#search-results')).toBeInTheDocument()
      expect(container.querySelector('table#search-results-list')).toBeInTheDocument()

      // Search table headers
      expect(queryByText('Title')).toBeInTheDocument()
      expect(queryByText('Type')).toBeInTheDocument()
      expect(queryByText('Institution')).toBeInTheDocument()
      expect(getByText('Modified', 'th')).toBeInTheDocument()
      // It has a sort button
      expect(getByText('Sort by')).toBeInTheDocument()

      // First row of search results
      expect(queryByText('An item title')).toBeInTheDocument()
      expect(queryByText('2019-10-23T22:42:57.623Z')).toBeInTheDocument()
      expect(queryByText('http://schema.org/Thing')).toBeInTheDocument()
      expect(queryByText('Stanford University')).toBeInTheDocument()
    })
  })

  it('renders errors', () => {
    const state = {
      selectorReducer: {
        resource: {},
        editor: {
          errors: {
            searchresource: ['Ooops'],
          },
        },
        entities: {
          resourceTemplateSummaries: {},
        },
        search: {
          results: [{
            uri: 'some/stanford/path',
            type: ['http://schema.org/Thing'],
            label: 'An item title',
            modified: '2019-10-23T22:42:57.623Z',
            created: '2019-10-23T22:42:57.623Z',
          }],
          totalResults: 1,
          query: 'twain',
        },
      },
    }

    const store = createReduxStore(state)
    const { getByText } = renderWithRedux(
      <SinopiaSearchResults />, store,
    )
    expect(getByText('Ooops')).toBeInTheDocument()
  })
})
