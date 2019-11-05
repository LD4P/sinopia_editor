// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
// eslint-disable-next-line import/no-unresolved
import {
  renderWithRedux, createReduxStore, setupModal, renderWithReduxAndRouter,
} from 'testUtils'
import App from 'components/App'
import { Router } from 'react-router-dom'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'
/* eslint import/namespace: 'off' */
import * as sinopiaServer from 'sinopiaServer'
import { createMemoryHistory } from 'history'

jest.mock('sinopiaServer')

sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)

const createInitialState = (options = {}) => {
  const state = {
    authenticate: {
    },
    selectorReducer: {
      resource: {},
      entities: {
        resourceTemplates: {},
        languages: {
          loading: false,
          options: [],
        },
        lookups: {},
        exports: [],
      },
      editor: {
        copyToNewMessage: {},
        modal: {
          messages: [],
          name: undefined,
        },
        resourceValidation: {
          show: false,
          errors: [],
          errorsByPath: {},
        },
        errors: {},
      },
      appVersion: {
        version: undefined,
        lastChecked: Date.now(),
      },
      search: {
        results: [],
        totalResults: 0,
        query: undefined,
        authority: undefined,
        error: undefined,
        resultsPerPage: 15,
        startOfRange: 0,
      },
      templateSearch: {
        results: [],
        totalResults: 0,
        error: undefined,
      },
    },
  }

  if (options.authenticated) {
    state.authenticate.authenticationState = { currentSession: { idToken: {} } }
  }
  if (options.hasResource) {
    state.selectorReducer.resource = {
      'resourceTemplate:bf2:Note': {
        'http://www.w3.org/2000/01/rdf-schema#label': {
          items: {
            '3Qnc1x-T': {
              content: 'foo',
              lang: 'en',
            },
          },
        },
      },
    }
    state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:Note'] = {
      id: 'resourceTemplate:bf2:Note',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
      resourceLabel: 'Note',
      propertyTemplates: [
        {
          propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
          propertyLabel: 'Note',
          mandatory: 'false',
          repeatable: 'false',
          type: 'literal',
          resourceTemplates: [],
          valueConstraint: {
            valueTemplateRefs: [],
            useValuesFrom: [],
            valueDataType: {},
            editable: 'true',
            repeatable: 'false',
            defaults: [],
          },
        },
      ],
    }
  }
  return state
}

setupModal()

describe('<App />', () => {
  it('renders', () => {
    const store = createReduxStore(createInitialState({ authenticated: true }))
    const { getByText } = renderWithReduxAndRouter((<App />), store)
    // renders login panel
    expect(getByText('Sign out')).toBeInTheDocument()

    // renders footer
    expect(getByText(/Sinopia is a project/)).toBeInTheDocument()
  })

  it('loads languages', async () => {
    const store = createReduxStore(createInitialState({ authenticated: true }))
    renderWithReduxAndRouter((<App />), store)

    await wait(() => store.getState().selectorReducer.entities.languages.options.size > 0)
  })

  it('sets app version', async () => {
    const store = createReduxStore(createInitialState({ authenticated: true }))
    const { getByText } = renderWithReduxAndRouter((<App />), store)
    fireEvent.click(getByText('Linked Data Editor'))

    expect(getByText(/v\d+\.\d+\.\d+/)).toBeInTheDocument()
  })

  it('loads exports', async () => {
    const store = createReduxStore(createInitialState({ authenticated: true }))
    const { getByText, findByText } = renderWithReduxAndRouter((<App />), store)
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.click(getByText('Exports'))

    expect(await findByText(/sinopia_export_all/)).toBeInTheDocument()
  })

  describe('when user is not authenticated', () => {
    it('renders homepage for /', () => {
      const store = createReduxStore(createInitialState())
      const { getByTestId } = renderWithReduxAndRouter((<App />), store, ['/'])

      expect(getByTestId('news-item')).toBeInTheDocument()
    })

    it('renders homepage for /search', () => {
      const store = createReduxStore(createInitialState())
      const { getByTestId } = renderWithReduxAndRouter((<App />), store, ['/search'])

      expect(getByTestId('news-item')).toBeInTheDocument()
    })

    it('renders homepage for /<anything>', () => {
      const store = createReduxStore(createInitialState())
      const { getByTestId } = renderWithReduxAndRouter((<App />), store, ['/foo'])

      expect(getByTestId('news-item')).toBeInTheDocument()
    })
  })

  describe('when user is authenticated and there is no resource', () => {
    it('renders homepage for /', () => {
      const store = createReduxStore(createInitialState({ authenticated: true }))
      const { getByTestId } = renderWithReduxAndRouter((<App />), store, ['/'])

      expect(getByTestId('news-item')).toBeInTheDocument()
    })

    it('creates new resource and renders editor for /editor/<rtId>', async () => {
      const store = createReduxStore(createInitialState({ authenticated: true }))
      const { findByText } = renderWithReduxAndRouter((<App />), store, ['/editor/resourceTemplate:bf2:Note'])

      expect(await findByText('Note', { selector: 'h1 > em' })).toBeInTheDocument()
    })

    it('redirects to /templates when for /editor/<rtId> when rtId not found', async () => {
      const store = createReduxStore(createInitialState({ authenticated: true }))
      const history = createMemoryHistory()
      history.push('/editor/resourceTemplate:bf2:Notex')
      const { findByText } = renderWithRedux((<Router history={history}><App /></Router>), store)
      await wait(() => expect(history.location.pathname).toEqual('/templates'))
      expect(await findByText(/Error retrieving resourceTemplate:bf2:Notex/)).toBeInTheDocument()
    })

    it('renders templates for /templates', async () => {
      const store = createReduxStore(createInitialState({ authenticated: true }))
      const { findByText } = renderWithReduxAndRouter((<App />), store, ['/templates'])

      expect(await findByText('Find a resource template')).toBeInTheDocument()
    })

    it('renders search for /search', () => {
      const store = createReduxStore(createInitialState({ authenticated: true }))
      const { getByLabelText } = renderWithReduxAndRouter((<App />), store, ['/search'])

      expect(getByLabelText('Query')).toBeInTheDocument()
    })

    it('renders load for /load', () => {
      const store = createReduxStore(createInitialState({ authenticated: true }))
      const { getByText } = renderWithReduxAndRouter((<App />), store, ['/load'])

      expect(getByText('Load RDF into Editor')).toBeInTheDocument()
    })

    it('renders menu for /menu', async () => {
      const store = createReduxStore(createInitialState({ authenticated: true }))
      const { findByText } = renderWithReduxAndRouter((<App />), store, ['/menu'])

      expect(await findByText('Sinopia help site')).toBeInTheDocument()
    })

    it('404s for /<anything else>', () => {
      const store = createReduxStore(createInitialState({ authenticated: true }))
      const { getByText } = renderWithReduxAndRouter((<App />), store, ['/foo'])

      expect(getByText('404')).toBeInTheDocument()
    })
  })

  describe('when user is authenticated and there is a resource', () => {
    it('renders resource for /editor', () => {
      const store = createReduxStore(createInitialState({ authenticated: true, hasResource: true }))
      const { getByText } = renderWithReduxAndRouter((<App />), store, ['/editor'])

      expect(getByText('Note', { selector: 'h1 > em' })).toBeInTheDocument()
      expect(getByText('foo')).toBeInTheDocument()
    })
    // This should not actually occur in the app.
    it('renders resource for /editor/<rtId>', () => {
      const store = createReduxStore(createInitialState({ authenticated: true, hasResource: true }))
      const { getByText } = renderWithReduxAndRouter((<App />), store, ['/editor/resourceTemplate:bf2:Note'])

      expect(getByText('Note', { selector: 'h1 > em' })).toBeInTheDocument()
      expect(getByText('foo')).toBeInTheDocument()
    })
  })
})
