// Copyright 2019 Stanford University see LICENSE for license

import 'isomorphic-fetch'
import React from 'react'
import { mount, shallow } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import App from 'components/App'
import LoginPanel from 'components/LoginPanel'
import HomePage from 'components/home/HomePage'
import Editor from 'components/editor/Editor'
import Search from 'components/search/Search'
import CanvasMenu from 'components/menu/CanvasMenu'
import Footer from 'components/Footer'
import ImportResourceTemplate from 'components/templates/ImportResourceTemplate'

jest.mock('components/editor/Editor', () => () => 'MockEditor')
jest.mock('components/templates/ImportResourceTemplate')

describe('<App />', () => {
  const mockStoreAppVersion = jest.fn()
  const mockFetchResourceTemplateSummaries = jest.fn()
  const wrapper = shallow(<App.WrappedComponent saveAppVersion={mockStoreAppVersion}
                                                fetchResourceTemplateSummaries={mockFetchResourceTemplateSummaries} />)

  it('is selectable by id "#app"', () => {
    expect(wrapper.find('div#app').length).toEqual(1)
  })

  it('renders the LoginPanel component', () => {
    expect(wrapper.find(LoginPanel).length).toEqual(1)
  })

  it('renders the Footer component', () => {
    expect(wrapper.find(Footer).length).toBe(1)
  })

  it('calls saveAppVersion on componentDidMount', () => {
    expect(mockStoreAppVersion).toBeCalled()
  })

  it('calls fetchResourceTemplateSummaries on componentDidMount', () => {
    expect(mockFetchResourceTemplateSummaries).toBeCalled()
  })
})

describe('#routes', () => {
  // Pattern cribbed/adapted from https://stackoverflow.com/a/54807560
  const makeStoreFake = state => ({
    default: () => {
    },
    subscribe: () => {
    },
    dispatch: () => {
    },
    getState: () => ({ ...state }),
  })

  describe('when the user is not authenticated', () => {
    const unauthenticatedStoreFake = makeStoreFake({
      selectorReducer: {
        appVersion: {
          version: undefined,
          lastChecked: Date.now(),
        },
        resource: { 'myOrg:myRt': {} },
        search: { results: [] },
      },
      authenticate: {
        authenticationState: {
          currentSession: null,
        },
      },
    })

    const renderRoutes = path => mount(
      <Provider store={unauthenticatedStoreFake}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </Provider>,
    )

    it('renders the HomePage component when "/" is visited', () => {
      const component = renderRoutes('/')

      expect(component.find(HomePage).length).toEqual(1)
    })

    it('renders the HomePage component when "/search" is visited', () => {
      const component = renderRoutes('/search')

      expect(component.find(HomePage).length).toEqual(1)
    })

    it('renders the HomePage for unknown path', () => {
      const component = renderRoutes('/blah')

      expect(component.find(HomePage).length).toEqual(1)
    })

    afterAll(() => {
      renderRoutes.unmount()
    })
  })

  describe('when the user is authenticated', () => {
    const authenticatedStoreFake = makeStoreFake({
      authenticate: {
        authenticationState: {
          currentSession: { wouldBe: 'a CognitoSession obj IRL, but only presence is checked ATM' },
        },
      },
      selectorReducer: {
        appVersion: {
          version: undefined,
          lastChecked: Date.now(),
        },
        resource: { 'myOrg:myRt': {} },
        search: { results: [] },
        editor: {
          retrieveResourceTemplateError: undefined,
        },
      },
    })

    const renderRoutes = path => mount(
      <Provider store={authenticatedStoreFake}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </Provider>,
    )

    it('renders the ImportResourceTemplate component when "/templates" is visited', () => {
      const component = renderRoutes('/templates')

      expect(component.find(ImportResourceTemplate).length).toEqual(1)
    })

    it('renders a 404 for an unknown path', () => {
      const component = renderRoutes('/blah')

      expect(component.contains(<h1>404</h1>)).toEqual(true)
    })

    it('renders the Editor component when "/editor" is visited with resource', () => {
      const component = renderRoutes('/editor')

      expect(component.find(Editor).length).toEqual(1)
    })

    it('renders the Search component when "/search" is visited', () => {
      const component = renderRoutes('/search')

      expect(component.find(Search).length).toEqual(1)
    })

    it('renders the Menu component when "/menu" is visited', () => {
      const component = renderRoutes('/menu')

      expect(component.find(CanvasMenu).length).toEqual(1)
    })

    afterAll(() => {
      renderRoutes.unmount()
    })
  })

  describe('when the user is authenticated and there is no resource', () => {
    const authenticatedStoreFake = makeStoreFake({
      authenticate: {
        authenticationState: {
          currentSession: { wouldBe: 'a CognitoSession obj IRL, but only presence is checked ATM' },
        },
      },
      selectorReducer: {
        appVersion: {
          version: undefined,
          lastChecked: Date.now(),
        },
        resource: {},
      },
    })

    const renderRoutes = path => mount(
      <Provider store={authenticatedStoreFake}>
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      </Provider>,
    )

    it('redirects to /templates when "/editor" is visited without resource', () => {
      const component = renderRoutes('/editor')

      expect(component.find(ImportResourceTemplate).length).toEqual(1)
    })

    afterAll(() => {
      renderRoutes.unmount()
    })
  })
})
