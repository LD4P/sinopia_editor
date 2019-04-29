// Copyright 2018 Stanford University see Apache2.txt for license

import 'jsdom-global/register'
import React from 'react'
import { mount, shallow } from "enzyme"
import { MemoryRouter } from "react-router"
import RootContainer from '../../src/components/RootContainer'
import App from '../../src/components/App'
import Config from '../../src/Config'
import HomePage from '../../src/components/HomePage'
import Editor from '../../src/components/editor/Editor'
import Browse from '../../src/components/editor/Browse'
import Login from '../../src/components/Login'
import Footer from '../../src/components/Footer'

describe('<App />', () =>{
  const wrapper = shallow(<App.WrappedComponent />)

  it('selectable by id "#app"', () => {
    expect(wrapper.find('div#app').length).toEqual(1)
  })

  it('renders <Footer />', () => {
    expect(wrapper.find(Footer).length).toBe(1)
  })

})

describe("#routes", () => {

  describe('public routes', () => {
    const renderRoutes = path =>
      mount(
        <MemoryRouter initialEntries={[path]}>
          <RootContainer />
        </MemoryRouter>
      )

    it('root renders HomePage component', async () => {
      const component = renderRoutes("/")
      await expect(component.find(HomePage).length).toEqual(1)
    })

    it('/editor renders Editor component', () => {
      // Stub `Config.spoofSinopiaServer` static getter to force RT to come from server
      jest.spyOn(Config, 'spoofSinopiaServer', 'get').mockReturnValue(false)
      const component = renderRoutes("/editor")
      expect(component.find(Editor).length).toEqual(1)
    })

    it('/import renders the Login component (with location props) if the user is not authenticated', () => {
      const component = renderRoutes("/import")
      expect(component.find(Login).length).toEqual(1)
      expect(component.find(Login).prop('location')).toBeDefined()
    })

    it('/browse renders the Browse component', () => {
      const component = renderRoutes("/browse")
      expect(component.find(Browse).length).toEqual(1)
    })

    it("invalid path renders a 404", () => {
      const component = renderRoutes("/blah")
      expect(component.contains(<h1>404</h1>)).toEqual(true)
    })

    afterAll(() => {
      renderRoutes.unmount()
    })

  })

  //TODO: https://github.com/LD4P/sinopia_editor/issues/380
  //  Fix getting jwtAuth props to appear in the App component so that PrivateRoute will not trigger the Login component
  // describe('Private route', () => {
  //   const renderRoutes = path =>
  //     mount(
  //       <MemoryRouter initialEntries={[path]}>
  //         <RootContainer>
  //           <App />
  //         </RootContainer>
  //       </MemoryRouter>
  //     )
  //
  //   it('/import renders the Import component if user is authenticated', () => {
  //     const component = renderRoutes("/import").setProps({jwtAuth:{isAuthenticated: true}})
  //     console.warn(component.props())
  //     component.update()
  //     expect(component.find(ImportResourceTemplate).length).toEqual(1)
  //   })
  // })

})
