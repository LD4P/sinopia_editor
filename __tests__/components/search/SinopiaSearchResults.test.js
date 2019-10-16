// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { renderWithRedux, createReduxStore } from 'testUtils'
import SinopiaSearchResults from 'components/search/SinopiaSearchResults'
import SinopiaSort from 'components/search/SinopiaSort'

describe('<SinopiaSearchResults />', () => {
  const state = {
    selectorReducer: {
      editor: {
        retrieveResourceError: undefined,
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
        label: 'An item title',
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

      // First row of search results
      expect(queryByText('An item title')).toBeInTheDocument()
      expect(queryByText('Stanford University')).toBeInTheDocument()
    })

    it('has a sort', () => {
      expect(wrapper.find(SinopiaSort).length).toBe(1)
    })
  })
})
