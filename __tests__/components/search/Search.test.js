/* eslint import/namespace: 'off' */
import React from 'react'
import { fireEvent } from '@testing-library/react'
import Search from 'components/search/Search'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore } from 'testUtils'
import { MemoryRouter } from 'react-router-dom'
import * as sinopiaServer from 'sinopiaServer'

describe('<Search />', () => {
  const createInitialState = (options = {}) => {
    const state = {
      selectorReducer: {
        resource: {},
        search: {
          results: [],
          totalResults: 0,
          query: undefined,
        },
        appVersion: {
          version: '1.0.2',
          lastChecked: 1569901390063,
        },
      },
    }

    if (options.error) {
      state.selectorReducer.search = {
        query: '*',
        totalResults: 0,
        results: [],
        error: {
          message: 'Grrr...',
        },
      }
    }

    return state
  }

  it('requests a QA search', () => {
    const store = createReduxStore(createInitialState())
    const mockGetSearchResults = jest.fn()
    sinopiaServer.getSearchResults = mockGetSearchResults

    const { container, getByLabelText, getByDisplayValue } = renderWithRedux(
      <MemoryRouter><Search /></MemoryRouter>, store,
    )

    expect(getByLabelText('Search')).toBeInTheDocument()
    // Sinopia is selected by default
    expect(getByDisplayValue('Sinopia')).toBeInTheDocument()

    // Select an authority
    fireEvent.change(getByDisplayValue('Sinopia'), { target: { value: 'sharevde_stanford_ld4l_cache' } })
    expect(getByDisplayValue('SHAREVDE STANFORD')).toBeInTheDocument()

    // Enter a query
    fireEvent.change(getByLabelText('Query'), { target: { value: 'foo' } })

    // Click search
    fireEvent.click(container.querySelector('button[type="submit"]'))

    // Nothing called (since not yet implemented)
    expect(mockGetSearchResults.mock.calls.length).toBe(0)
  })

  it('requests a Sinopia search', () => {
    const store = createReduxStore(createInitialState())

    const mockGetSearchResults = jest.fn()
    sinopiaServer.getSearchResults = mockGetSearchResults.mockResolvedValue({
      totalHits: 0,
      results: [],
    })

    const { container, getByLabelText } = renderWithRedux(
      <MemoryRouter><Search /></MemoryRouter>, store,
    )

    // Enter a query
    fireEvent.change(getByLabelText('Query'), { target: { value: 'foo' } })

    // Click search
    fireEvent.click(container.querySelector('button[type="submit"]'))

    // Called once
    expect(mockGetSearchResults).toBeCalledWith('foo', 0)
  })

  it('requests on enter', () => {
    const store = createReduxStore(createInitialState())

    const mockGetSearchResults = jest.fn()
    sinopiaServer.getSearchResults = mockGetSearchResults.mockResolvedValue({
      totalHits: 0,
      results: [],
    })
    const { getByLabelText } = renderWithRedux(
      <MemoryRouter><Search /></MemoryRouter>, store,
    )

    // Enter a query
    fireEvent.change(getByLabelText('Query'), { target: { value: 'foo' } })

    // Hit enter
    fireEvent.keyPress(getByLabelText('Query'), { key: 'Enter', code: 13, charCode: 13 })

    // Called once
    expect(mockGetSearchResults).toBeCalledWith('foo', 0)
  })

  it('ignores when query is blank', () => {
    const store = createReduxStore(createInitialState())

    const mockGetSearchResults = jest.fn()
    const { getByLabelText } = renderWithRedux(
      <MemoryRouter><Search /></MemoryRouter>, store,
    )

    // Hit enter
    fireEvent.keyPress(getByLabelText('Query'), { key: 'Enter', code: 13, charCode: 13 })

    // Not called
    expect(mockGetSearchResults.mock.calls.length).toBe(0)
  })

  it('displays an error message', () => {
    const store = createReduxStore(createInitialState({ error: true }))

    const { getByText } = renderWithRedux(
      <MemoryRouter><Search /></MemoryRouter>, store,
    )

    expect(getByText('Grrr...')).toBeInTheDocument()
  })
})
