// Copyright 2019 Stanford University see LICENSE for license
import { fireEvent, wait, screen } from '@testing-library/react'
import { createStore, renderApp, createHistory } from 'testUtils'
import { createState } from 'stateUtils'
import Config from 'Config'

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

describe('<App />', () => {
  it('loads languages', async () => {
    const store = createStore()
    renderApp(store)

    await wait(() => store.getState().selectorReducer.entities.languages.options.size > 0)
  })

  it('sets app version', async () => {
    renderApp()

    fireEvent.click(screen.getByText('Linked Data Editor'))

    screen.getByText(/v\d+\.\d+\.\d+/)
  })

  it('loads exports', async () => {
    renderApp()

    fireEvent.click(screen.getByText('Linked Data Editor'))
    fireEvent.click(screen.getByText('Exports'))

    await screen.findByText(/sinopia_export_all/)
  })

  describe('when user is not authenticated', () => {
    const state = createState({ notAuthenticated: true })
    const store = createStore(state)

    it('renders homepage for /', () => {
      const history = createHistory(['/'])
      renderApp(store, history)

      screen.getByTestId('news-item')
    })

    it('renders homepage for /search', () => {
      const history = createHistory(['/search'])
      renderApp(store, history)

      screen.getByTestId('news-item')
    })

    it('renders homepage for /<anything>', () => {
      const history = createHistory(['/foo'])
      renderApp(store, history)

      screen.getByTestId('news-item')
    })
  })

  describe('when user is authenticated and there is no resource', () => {
    it('renders homepage for /', () => {
      const history = createHistory(['/'])
      renderApp(null, history)

      screen.getByTestId('news-item')
    })

    it('creates new resource and renders editor for /editor/<rtId>', async () => {
      const history = createHistory(['/editor/resourceTemplate:bf2:Note'])
      renderApp(null, history)

      await screen.findByText('Note', { selector: 'h3' })
    })

    it('redirects to /templates when for /editor/<rtId> when rtId not found', async () => {
      const history = createHistory(['/editor/resourceTemplate:bf2:Notex'])
      renderApp(null, history)

      await wait(() => expect(history.location.pathname).toEqual('/templates'))
      await screen.findByText(/Error retrieving resourceTemplate:bf2:Notex/)
    })

    it('renders templates for /templates', async () => {
      const history = createHistory(['/templates'])
      renderApp(null, history)

      await screen.findByText('Find a resource template')
    })

    it('renders search for /search', () => {
      const history = createHistory(['/search'])
      renderApp(null, history)

      screen.getByLabelText('Query')
    })

    it('renders load for /load', () => {
      const history = createHistory(['/load'])
      renderApp(null, history)

      screen.getByText('Load RDF into Editor')
    })

    it('renders menu for /menu', async () => {
      const history = createHistory(['/menu'])
      renderApp(null, history)

      await screen.findByText('Sinopia help site')
    })

    it('404s for /<anything else>', () => {
      const history = createHistory(['/foo'])
      renderApp(null, history)

      screen.getByText('404')
    })
  })

  describe('when user is authenticated and there is a resource', () => {
    it('renders resource for /editor', async () => {
      const state = createState({ hasResourceWithLiteral: true })
      const store = createStore(state)
      const history = createHistory(['/'])
      renderApp(store, history)
      history.push('/editor')

      await screen.findByText('Abbreviated Title', { selector: 'h3' })
      screen.getByText('foo')
    })
  })
})
