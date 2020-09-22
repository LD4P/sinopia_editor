import React from 'react'
import GroupFilter from 'components/search/GroupFilter'
import { createStore, renderComponent } from 'testUtils'
import { createState } from 'stateUtils'
import { fireEvent, waitFor, screen } from '@testing-library/react'
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

  const createInitialState = () => {
    const state = createState()
    state.search.resource = {
      facetResults,
      query: 'twain',
    }
    return state
  }

  it('does not render when no facet results', () => {
    renderComponent(<GroupFilter />)

    expect(screen.queryByText('Filter by institution')).not.toBeInTheDocument()
  })

  it('renders when results', () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([{}, undefined])

    const store = createStore(createInitialState())
    const { container } = renderComponent(<GroupFilter />, store)

    expect(screen.getByText('Filter by institution')).toBeInTheDocument()
    expect(screen.getByText('Stanford University (5)')).toBeInTheDocument()
    expect(screen.getByText('Princeton University (1)')).toBeInTheDocument()

    // Everything checked
    expect(container.querySelectorAll('input:checked')).toHaveLength(4)
  })

  it('allows changing filters by unselecting', async () => {
    const mockGetSearchResults = jest.fn()
    server.getSearchResultsWithFacets = mockGetSearchResults.mockResolvedValue([{}, undefined])

    const store = createStore(createInitialState())
    const { container } = renderComponent(<GroupFilter />, store)

    expect(container.querySelector('div.show')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Filter by institution'))
    expect(container.querySelector('div.show')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Stanford University (5)'))

    // 3 checked
    expect(container.querySelectorAll('input:checked').length).toBe(3)

    // Apply filter
    fireEvent.click(screen.getByText('Go'))

    await waitFor(() => expect(container.querySelector('div.show')).not.toBeInTheDocument())

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

    const store = createStore(createInitialState())
    const { container } = renderComponent(<GroupFilter />, store)

    fireEvent.click(screen.getByText('Filter by institution'))
    fireEvent.click(screen.getAllByText('Only')[0])

    // 3 checked
    expect(container.querySelectorAll('input:checked')).toHaveLength(1)

    // Apply filter
    fireEvent.click(screen.getByText('Go'))

    await waitFor(() => expect(container.querySelector('div.show')).not.toBeInTheDocument())

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

    const store = createStore(createInitialState())
    const { container } = renderComponent(<GroupFilter />, store)
    fireEvent.click(screen.getByText('Filter by institution'))
    fireEvent.click(screen.getByText('Stanford University (5)'))

    // 3 checked
    expect(container.querySelectorAll('input:checked').length).toBe(3)

    // Apply filter
    fireEvent.click(screen.getByText('Go'))

    await waitFor(() => expect(container.querySelector('div.show')).not.toBeInTheDocument())

    fireEvent.click(screen.getByText('Filter by institution'))
    fireEvent.click(screen.getByText('Clear filter'))

    expect(mockGetSearchResults).toHaveBeenLastCalledWith('twain', {
      resultsPerPage: 10,
      startOfRange: 0,
      sortField: undefined,
      sortOrder: undefined,
      groupFilter: undefined,
    })
  })
})
