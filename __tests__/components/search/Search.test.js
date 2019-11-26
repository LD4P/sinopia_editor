/* eslint import/namespace: 'off' */
import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import Search from 'components/search/Search'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import { MemoryRouter } from 'react-router-dom'
import * as server from 'sinopiaSearch'
import Swagger from 'swagger-client'
import Config from 'Config'

jest.mock('swagger-client')


describe('<Search />', () => {
  setupModal()

  it('requests a QA search', async () => {
    const mockSearchResults = [
      {
        uri: 'http://share-vde.org/sharevde/rdfBibframe/Work/3107365',
        id: 'http://share-vde.org/sharevde/rdfBibframe/Work/3107365',
        label: 'These twain',
        context: [
          {
            property: 'Title',
            values: [
              ' These twain',
            ],
            selectable: true,
            drillable: false,
          },
          {
            property: 'Type',
            values: [
              'http://id.loc.gov/ontologies/bflc/Hub',
              'http://id.loc.gov/ontologies/bibframe/Work',
            ],
            selectable: false,
            drillable: false,
          },
          {
            property: 'Contributor',
            values: [
              'Bennett, Arnold,1867-1931.',
            ],
            selectable: false,
            drillable: false,
          },
        ],
      }]
    const mockActionFunction = jest.fn().mockResolvedValue({ body: mockSearchResults })
    const client = { apis: { SearchQuery: { GET_searchAuthority: mockActionFunction } } }
    Swagger.mockResolvedValue(client)

    const store = createReduxStore(createBlankState())

    const {
      container, getByLabelText, getByDisplayValue, findByText, getByText,
    } = renderWithRedux(
      <MemoryRouter><Search history={{}} /></MemoryRouter>, store,
    )

    expect(getByLabelText('Search')).toBeInTheDocument()
    // Sinopia is selected by default
    expect(getByDisplayValue('Sinopia')).toBeInTheDocument()

    // Select an authority
    fireEvent.change(getByDisplayValue('Sinopia'), { target: { value: 'urn:ld4p:qa:sharevde_stanford_ld4l_cache:all' } })

    expect(getByText('SHAREVDE STANFORD')).toBeInTheDocument()

    // Enter a query
    fireEvent.change(getByLabelText('Query'), { target: { value: 'twain' } })

    // Click search
    fireEvent.click(container.querySelector('button[type="submit"]'))

    // Display results
    expect(await findByText('Label')).toBeInTheDocument()
    expect(getByText('These twain')).toBeInTheDocument()
  })

  it('requests a Sinopia search', async () => {
    const store = createReduxStore(createBlankState())

    const mockGetSearchResults = jest.fn()
    server.getSearchResults = mockGetSearchResults.mockResolvedValue({
      totalHits: 1,
      results: [
        {
          uri: 'repository/cornell/ca0d53d0-2b99-4f75-afb0-739a6f0af4f4',
          label: 'foo',
          title: ['foo'],
          type: ['http://id.loc.gov/ontologies/bibframe/Title'],
        },
      ],
    })

    const {
      container, getByLabelText, findByText, getByText,
    } = renderWithRedux(
      <MemoryRouter><Search history={{}} /></MemoryRouter>, store,
    )

    // Enter a query
    fireEvent.change(getByLabelText('Query'), { target: { value: 'foo' } })

    // Click search
    fireEvent.click(container.querySelector('button[type="submit"]'))

    // Called once
    expect(mockGetSearchResults).toBeCalledWith('foo', {
      startOfRange: 0, resultsPerPage: 10, sortField: undefined, sortOrder: undefined,
    })

    // Result
    expect(await findByText('foo')).toBeInTheDocument()

    expect(getByText('http://id.loc.gov/ontologies/bibframe/Title', { selector: 'li' }))
      .toBeInTheDocument()
  })

  it('requests on enter', () => {
    const store = createReduxStore(createBlankState())

    const mockGetSearchResults = jest.fn()
    server.getSearchResults = mockGetSearchResults.mockResolvedValue({
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
    expect(mockGetSearchResults).toBeCalledWith('foo', {
      startOfRange: 0, resultsPerPage: 10, sortField: undefined, sortOrder: undefined,
    })
  })

  it('ignores when query is blank', () => {
    const store = createReduxStore(createBlankState())

    const mockGetSearchResults = jest.fn()
    const { getByLabelText } = renderWithRedux(
      <MemoryRouter><Search /></MemoryRouter>, store,
    )

    // Hit enter
    fireEvent.keyPress(getByLabelText('Query'), { key: 'Enter', code: 13, charCode: 13 })

    // Not called
    expect(mockGetSearchResults.mock.calls.length).toBe(0)
  })

  it('displays an error message', async () => {
    server.getSearchResults = jest.fn().mockResolvedValue({
      totalHits: 0,
      results: [],
      error: new Error('Grrr...'),
    })

    const store = createReduxStore(createBlankState())

    const { findByText, getByLabelText, container } = renderWithRedux(
      <MemoryRouter><Search /></MemoryRouter>, store,
    )

    // Enter a query
    fireEvent.change(getByLabelText('Query'), { target: { value: 'foo' } })

    // Click search
    fireEvent.click(container.querySelector('button[type="submit"]'))

    expect(await findByText('An error occurred while searching: Error: Grrr...')).toBeInTheDocument()
  })

  it('retains sort order when paging', async () => {
    jest.spyOn(Config, 'searchResultsPerPage', 'get').mockReturnValue(2)
    const store = createReduxStore(createBlankState())

    const mockGetSearchResults = jest.fn()
    server.getSearchResults = mockGetSearchResults.mockResolvedValue({
      totalHits: 3,
      results: [
        {
          uri: 'repository/cornell/ca0d53d0-2b99-4f75-afb0-739a6f0af4f4',
          label: 'foo1',
          title: ['foo1'],
          type: ['http://id.loc.gov/ontologies/bibframe/Title'],
        },
        {
          uri: 'repository/cornell/ca0d53d0-2b99-4f75-afb0-739a6f0af4f5',
          label: 'foo2',
          title: ['foo2'],
          type: ['http://id.loc.gov/ontologies/bibframe/Title'],
        },
        {
          uri: 'repository/cornell/ca0d53d0-2b99-4f75-afb0-739a6f0af4f6',
          label: 'foo3',
          title: ['foo3'],
          type: ['http://id.loc.gov/ontologies/bibframe/Title'],
        },
      ],
    })

    const {
      container, getByLabelText, findByText, getByText, queryByText,
    } = renderWithRedux(
      <MemoryRouter><Search history={{}} /></MemoryRouter>, store,
    )

    // Enter a query
    fireEvent.change(getByLabelText('Query'), { target: { value: 'foo' } })

    // Click search
    fireEvent.click(container.querySelector('button[type="submit"]'))

    expect(await findByText('Sort by')).toBeInTheDocument()

    // Change sort order
    expect(getByText('Relevance', { selector: 'button.active' })).toBeInTheDocument()
    fireEvent.click(getByText('Sort by'))
    fireEvent.click(getByText('Modified date, newest first'))

    await wait(() => expect(queryByText('Relevance', { selector: 'button.active' })).not.toBeInTheDocument())
    expect(getByText('Modified date, newest first', { selector: 'button.active' })).toBeInTheDocument()

    fireEvent.click(getByText('›'))

    expect(await findByText('2', { selector: 'li.active > button' })).toBeInTheDocument()
    expect(getByText('Modified date, newest first', { selector: 'button.active' })).toBeInTheDocument()

    expect(mockGetSearchResults.mock.calls).toEqual([
      ['foo', {
        startOfRange: 0, resultsPerPage: 2, sortField: undefined, sortOrder: undefined,
      }],
      ['foo', {
        startOfRange: 0, resultsPerPage: 2, sortField: 'modified', sortOrder: 'desc',
      }],
      ['foo', {
        startOfRange: 2, resultsPerPage: 2, sortField: 'modified', sortOrder: 'desc',
      }],
    ])
  })
})
