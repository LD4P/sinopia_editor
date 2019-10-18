/* eslint import/namespace: 'off' */
import React from 'react'
import { fireEvent } from '@testing-library/react'
import Search from 'components/search/Search'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore, setupModal } from 'testUtils'
import { MemoryRouter } from 'react-router-dom'
import * as server from 'sinopiaSearch'
import Swagger from 'swagger-client'

jest.mock('swagger-client')


describe('<Search />', () => {
  setupModal()

  const createInitialState = () => {
    return {
      selectorReducer: {
        resource: {},
        search: {
          results: [],
          totalResults: 0,
          query: undefined,
          resultsPerPage: 10,
        },
        appVersion: {
          version: '1.0.2',
          lastChecked: 1569901390063,
        },
        editor: {
          resourceTemplateChoice: {
            show: false,
          },
        },
        entities: {
          resourceTemplateSummaries: {},
        },
      },
    }
  }

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

    const store = createReduxStore(createInitialState())

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
    const store = createReduxStore(createInitialState())

    const mockGetSearchResults = jest.fn()
    server.getSearchResults = mockGetSearchResults.mockResolvedValue({
      totalHits: 1,
      results: [
        {
          uri: 'repository/cornell/ca0d53d0-2b99-4f75-afb0-739a6f0af4f4',
          label: 'foo',
          title: ['foo'],
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
    expect(mockGetSearchResults).toBeCalledWith('foo', 0, 10)

    // Result
    expect(await findByText('Your List of Bibliographic Metadata Stored in Sinopia')).toBeInTheDocument()

    expect(getByText('foo', { selector: 'button' })).toBeInTheDocument()
  })

  it('requests on enter', () => {
    const store = createReduxStore(createInitialState())

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
    expect(mockGetSearchResults).toBeCalledWith('foo', 0, 10)
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

  it('displays an error message', async () => {
    server.getSearchResults = jest.fn().mockResolvedValue({
      totalHits: 0,
      results: [],
      error: new Error('Grrr...'),
    })

    const store = createReduxStore(createInitialState())

    const { findByText, getByLabelText, container } = renderWithRedux(
      <MemoryRouter><Search /></MemoryRouter>, store,
    )

    // Enter a query
    fireEvent.change(getByLabelText('Query'), { target: { value: 'foo' } })

    // Click search
    fireEvent.click(container.querySelector('button[type="submit"]'))

    expect(await findByText('An error occurred while searching: Error: Grrr...')).toBeInTheDocument()
  })
})
