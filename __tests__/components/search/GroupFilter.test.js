import React from 'react'
import GroupFilter from 'components/search/GroupFilter'
import { renderWithRedux, createReduxStore, createBlankState } from 'testUtils'
import { fireEvent, wait } from '@testing-library/react'
/* eslint import/namespace: 'off' */
import * as server from 'sinopiaSearch'

describe('<GroupFilter />', () => {
  const facetResults = {
    groups: [
      {
        key: 'stanford',
        doc_count: 5,
      },
      {
        key: 'cornell',
        doc_count: 4,
      },
      {
        key: 'yale',
        doc_count: 1,
      },
      {
        key: 'princeton',
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
      <GroupFilter />, store,
    )
    expect(queryByText('Filter by institution')).not.toBeInTheDocument()
  })

  it('renders when results', () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([{}, undefined])


    const store = createReduxStore(createState())
    const { getByText, container } = renderWithRedux(
      <GroupFilter />, store,
    )
    expect(getByText('Filter by institution')).toBeInTheDocument()
    expect(getByText('Stanford University (5)')).toBeInTheDocument()
    expect(getByText('Princeton University (1)')).toBeInTheDocument()

    // Everything checked
    expect(container.querySelectorAll('input:checked').length).toBe(4)
  })

  it('allows changing filters by unselecting', async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([{}, undefined])

    const store = createReduxStore(createState())
    const { getByText, container } = renderWithRedux(
      <GroupFilter />, store,
    )
    expect(container.querySelector('div.show')).not.toBeInTheDocument()
    fireEvent.click(getByText('Filter by institution'))
    expect(container.querySelector('div.show')).toBeInTheDocument()
    fireEvent.click(getByText('Stanford University (5)'))

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
      groupFilter: [
        'cornell',
        'yale',
        'princeton',
      ],
    })
  })

  it('allows selecting only', async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([{}, undefined])

    const store = createReduxStore(createState())
    const { getAllByText, container, getByText } = renderWithRedux(
      <GroupFilter />, store,
    )

    fireEvent.click(getByText('Filter by institution'))
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
      groupFilter: [
        'stanford',
      ],
    })
  })

  it('allows clearing filters', async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([{}, facetResults])

    const state = createState()
    const store = createReduxStore(state)
    const { getByText, container } = renderWithRedux(
      <GroupFilter />, store,
    )
    fireEvent.click(getByText('Filter by institution'))
    fireEvent.click(getByText('Stanford University (5)'))

    // 3 checked
    expect(container.querySelectorAll('input:checked').length).toBe(3)

    // Apply filter
    fireEvent.click(getByText('Go'))

    await wait(() => expect(container.querySelector('div.show')).not.toBeInTheDocument())

    fireEvent.click(getByText('Filter by institution'))
    fireEvent.click(getByText('Clear filter'))

    expect(mockGetSearchResults).toHaveBeenLastCalledWith('twain', {
      resultsPerPage: 10,
      startOfRange: 0,
      sortField: undefined,
      sortOrder: undefined,
      groupFilter: undefined,
    })
  })
})
