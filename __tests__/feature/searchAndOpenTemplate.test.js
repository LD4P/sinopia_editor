import { renderApp, createHistory, createStore } from 'testUtils'
import { act, fireEvent, screen } from '@testing-library/react'
import * as sinopiaSearch from 'sinopiaSearch'
import Config from 'Config'

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)
jest.mock('sinopiaSearch')

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })

describe('searching and opening a resource', () => {
  const history = createHistory(['/templates'])
  const store = createStore()
  const promise = Promise.resolve()

  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    results: [
      {
        id: 'resourceTemplate:bf2:Title',
        uri: 'http://localhost:3000/repository/resourceTemplate:bf2:Title',
        remark: 'Title information relating to a resource',
        resourceLabel: 'Instance Title',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Title',
      },
      {
        id: 'resourceTemplate:bf2:Title:Note',
        uri: 'http://localhost:3000/repository/resourceTemplate:bf2:Title:Note',
        remark: 'Note about the title',
        resourceLabel: 'Title note',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
      },
    ],
    totalHits: 2,
    options: {
      startOfRange: 0,
      resultsPerPage: 10,
    },
  })

  it('adds the template to recently used template history', async () => {
    renderApp(store, history)

    // Search for a template
    const input = screen.getByPlaceholderText('Enter id, label, URI, remark, or author')
    await fireEvent.change(input, { target: { value: 'title' } })
    await screen.findByText('resourceTemplate:bf2:Title:Note')

    // open the template
    const link = await screen.findByRole('link', { name: 'Title note' })
    fireEvent.click(link)
    await act(() => promise)

    // return the the RT list
    const rtLink = await screen.findByRole('link', { name: 'Resource Templates' })
    fireEvent.click(rtLink)

    // see the recently used RTs
    const histTemplateBtn = await screen.findByRole('button', { name: 'Most recently used resource templates' })
    fireEvent.click(histTemplateBtn)
    const rtHeaders = screen.getAllByText('Label / ID')
    expect(rtHeaders.length).toBe(2)

    // open the recenly used RTs and click
    const rtLinks = screen.getAllByRole('link', { name: 'Title note' })
    expect(rtLinks.length).toBe(2)
    fireEvent.click(rtLinks[0])
    await screen.findByRole('heading', { name: 'Title note' })

    // There are nav tabs and a duplicate resource
    const tabBtns = await screen.findAllByRole('button', { name: 'Title note' })
    expect(tabBtns[0]).not.toHaveClass('active')
    expect(tabBtns[1]).toHaveClass('active')
  })
})
