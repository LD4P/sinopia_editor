import React from 'react'
import TypeFilter from 'components/search/TypeFilter'
import { renderWithRedux, createReduxStore, createBlankState } from 'testUtils'
import { fireEvent, wait } from '@testing-library/react'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaSearch'

describe('<TypeFilter />', () => {
  const facetResults = {
    types: [
      {
        key: 'http://id.loc.gov/ontologies/bibframe/Title',
        doc_count: 5,
      },
      {
        key: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
        doc_count: 4,
      },
      {
        key: 'http://id.loc.gov/ontologies/bibframe/Barcode',
        doc_count: 1,
      },
      {
        key: 'http://id.loc.gov/ontologies/bibframe/Chronology',
        doc_count: 1,
      },
    ],
  }

  const createState = () => {
    const state = createBlankState()
    state.selectorReducer.search.facetResults = facetResults
    state.selectorReducer.search.query = 'twain'
    return state
  }

  it('does not render when no facet results', () => {
    const store = createReduxStore(createBlankState())
    const { queryByText } = renderWithRedux(
      <TypeFilter />, store,
    )
    expect(queryByText('Filter by class')).not.toBeInTheDocument()
  })

  it('renders when results', () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([{}, undefined])


    const store = createReduxStore(createState())
    const { getByText, container } = renderWithRedux(
      <TypeFilter />, store,
    )
    expect(getByText('Filter by class')).toBeInTheDocument()
    expect(getByText('http://id.loc.gov/ontologies/bibframe/Title (5)')).toBeInTheDocument()
    expect(getByText('http://id.loc.gov/ontologies/bibframe/Chronology (1)')).toBeInTheDocument()

    // Everything checked
    expect(container.querySelectorAll('input:checked').length).toBe(4)
  })

  it('allows changing filters by unselecting', async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([{}, undefined])

    const store = createReduxStore(createState())
    const { getByText, container } = renderWithRedux(
      <TypeFilter />, store,
    )
    expect(container.querySelector('div.show')).not.toBeInTheDocument()
    fireEvent.click(getByText('Filter by class'))
    expect(container.querySelector('div.show')).toBeInTheDocument()
    fireEvent.click(getByText('http://id.loc.gov/ontologies/bibframe/Title (5)'))

    // 3 checked
    expect(container.querySelectorAll('input:checked').length).toBe(3)

    // Apply filter
    fireEvent.click(getByText('Go'))

    await wait(() => expect(container.querySelector('div.show')).not.toBeInTheDocument())

    expect(mockGetSearchResults).toHaveBeenCalledWith('twain', {
      resultsPerPage: 10,
      startOfRange: 0,
      sortField: undefined,
      sortOrder: undefined,
      typeFilter: [
        'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
        'http://id.loc.gov/ontologies/bibframe/Barcode',
        'http://id.loc.gov/ontologies/bibframe/Chronology',
      ],
    })
  })

  it('allows selecting only', async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([{}, undefined])

    const store = createReduxStore(createState())
    const { getAllByText, container, getByText } = renderWithRedux(
      <TypeFilter />, store,
    )

    fireEvent.click(getByText('Filter by class'))
    fireEvent.click(getAllByText('Only')[0])

    // 3 checked
    expect(container.querySelectorAll('input:checked').length).toBe(1)

    // Apply filter
    fireEvent.click(getByText('Go'))

    await wait(() => expect(container.querySelector('div.show')).not.toBeInTheDocument())

    expect(mockGetSearchResults).toHaveBeenCalledWith('twain', {
      resultsPerPage: 10,
      startOfRange: 0,
      sortField: undefined,
      sortOrder: undefined,
      typeFilter: [
        'http://id.loc.gov/ontologies/bibframe/Title',
      ],
    })
  })

  it('allows clearing filters', async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([{}, facetResults])

    const state = createState()
    const store = createReduxStore(state)
    const { getByText, container } = renderWithRedux(
      <TypeFilter />, store,
    )
    fireEvent.click(getByText('Filter by class'))
    fireEvent.click(getByText('http://id.loc.gov/ontologies/bibframe/Title (5)'))

    // 3 checked
    expect(container.querySelectorAll('input:checked').length).toBe(3)

    // Apply filter
    fireEvent.click(getByText('Go'))

    await wait(() => expect(container.querySelector('div.show')).not.toBeInTheDocument())

    fireEvent.click(getByText('Filter by class'))
    fireEvent.click(getByText('Clear filter'))

    expect(mockGetSearchResults).toHaveBeenLastCalledWith('twain', {
      resultsPerPage: 10,
      startOfRange: 0,
      sortField: undefined,
      sortOrder: undefined,
      typeFilter: undefined,
    })
  })
})
