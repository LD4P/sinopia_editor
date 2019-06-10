// Copyright 2018 Stanford University see LICENSE for license

import 'jsdom-global/register'
import React from 'react'
import { mount, shallow } from 'enzyme'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import App from '../../src/components/App'
import LoginPanel from '../../src/components/LoginPanel'
import HomePage from '../../src/components/HomePage'
import Editor from '../../src/components/editor/Editor'
import Browse from '../../src/components/editor/Browse'
import CanvasMenu from '../../src/components/CanvasMenu'
import Footer from '../../src/components/Footer'
import ImportResourceTemplate from '../../src/components/editor/ImportResourceTemplate'

jest.mock('../../src/components/editor/Editor')
jest.mock('../../src/components/editor/ImportResourceTemplate')

describe('<App />', () => {
  const wrapper = shallow(<App.WrappedComponent />)

  it('is selectable by id "#app"', () => {
    expect(wrapper.find('div#app').length).toEqual(1)
  })

  it('renders the LoginPanel component', () => {
    expect(wrapper.find(LoginPanel).length).toEqual(1)
  })

  it('renders the Footer component', () => {
    expect(wrapper.find(Footer).length).toBe(1)
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

  describe('public routes', () => {
    const unauthenticatedStoreFake = makeStoreFake({
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

    it('renders the Editor component when "/editor" is visited', () => {
      const component = renderRoutes('/editor')

      expect(component.find(Editor).length).toEqual(1)
    })

    it('renders the Browse component when "/browse" is visited', () => {
      const component = renderRoutes('/browse')

      expect(component.find(Browse).length).toEqual(1)
    })

    it('renders the Menu component when "/menu" is visited', () => {
      const component = renderRoutes('/menu')

      expect(component.find(CanvasMenu).length).toEqual(1)
    })

    it('does not render ImportResourceTemplate component (even if user visits "/templates"), since user is not logged in', () => {
      const component = renderRoutes('/templates')

      expect(component.find(ImportResourceTemplate).length).toEqual(0)
    })

    it('renders a 404 for an unknown path', () => {
      const component = renderRoutes('/blah')

      expect(component.contains(<h1>404</h1>)).toEqual(true)
    })

    afterAll(() => {
      renderRoutes.unmount()
    })
  })

  describe('private routes', () => {
    const authenticatedStoreFake = makeStoreFake({
      authenticate: {
        authenticationState: {
          currentSession: { wouldBe: 'a CognitoSession obj IRL, but only presence is checked ATM' },
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

    afterAll(() => {
      renderRoutes.unmount()
    })
  })
})
