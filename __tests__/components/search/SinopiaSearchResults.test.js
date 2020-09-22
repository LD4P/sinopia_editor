// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import SinopiaSearchResults from 'components/search/SinopiaSearchResults'
import { screen } from '@testing-library/react'
import { createStore, renderComponent } from 'testUtils'
import { createState } from 'stateUtils'

describe('<SinopiaSearchResults />', () => {
  describe('when there are no search results', () => {
    const { container } = renderComponent(<SinopiaSearchResults />)

    it('does not contain the main div', () => {
      expect(container.querySelector('div#search-results')).not.toBeInTheDocument()
      expect(screen.queryByText('Filter by class')).not.toBeInTheDocument()
    })
  })

  describe('when there are search results', () => {
    it('it contains the main div', () => {
      const state = createState()
      state.search.resource = {
        results: [{
          uri: 'https://api.sinopia.io/resource/some/path',
          type: ['http://schema.org/Thing'],
          group: ['stanford'],
          label: 'An item title',
          modified: '2019-10-23T22:42:57.623Z',
          created: '2019-10-23T22:42:57.623Z',
        }],
        facetResults: {
          types: [
            {
              key: 'http://schema.org/Thing',
              doc_count: 1,
            },
          ],
          groups: [
            {
              key: 'stanford',
              doc_count: 1,
            },
          ],

        },
      }

      const store = createStore(state)
      const { container } = renderComponent(<SinopiaSearchResults />, store)

      expect(container.querySelector('div#search-results')).toBeInTheDocument()
      expect(container.querySelector('table#search-results-list')).toBeInTheDocument()

      // Search table headers
      screen.queryByText('Label / ID')
      screen.queryByText('Class')
      screen.queryByText('Institution')
      screen.getByText('Modified', { selector: 'th' })

      // It has a sort button
      screen.getByText('Sort by')

      // It has filters
      screen.getByText('Filter by class')
      screen.getByText('Filter by institution')

      // First row of search results
      screen.queryByText(/An item title/)
      screen.queryByText(/https:\/\/api.sinopia.io\/resource\/some\/path/)
      screen.queryByText('Oct 23, 2019')
      screen.queryByText('http://schema.org/Thing')
      screen.queryByText('Stanford University')
    })
  })

  it('renders errors', () => {
    const state = createState()
    state.search.resource = {
      results: [{
        uri: 'http://platform:8080/resource/some/path',
        type: ['http://schema.org/Thing'],
        label: 'An item title',
        modified: '2019-10-23T22:42:57.623Z',
        created: '2019-10-23T22:42:57.623Z',
      }],
      totalResults: 1,
      query: 'twain',
      facetResults: {},
    }
    state.editor.errors.searchresource = ['Ooops']

    const store = createStore(state)
    renderComponent(<SinopiaSearchResults />, store)

    screen.getByText('Ooops')
  })
})
