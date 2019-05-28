// Copyright 2018 Stanford University see LICENSE for license

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
import Footer from '../../src/components/Footer'
import ImportResourceTemplate from "../../src/components/editor/ImportResourceTemplate";

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

    const renderEditorRoute = path =>
      mount(
        <MemoryRouter initialEntries={[path]}>
          <RootContainer>
            <App>
              <Editor location={{state: { resourceTemplateId: 'resourceTemplate:bf2:Monograph:Instance' }}} />
            </App>
          </RootContainer>
        </MemoryRouter>
      )

    it('root renders HomePage component', async () => {
      const component = renderRoutes("/")
      await expect(component.find(HomePage).length).toEqual(1)
    })

    // TODO: needs fixing for re-done authN approach, see #528
    it.skip('/editor renders Editor component', () => {
      // Stub `Config.spoofSinopiaServer` static getter to force RT to come from server
      jest.spyOn(Config, 'spoofSinopiaServer', 'get').mockReturnValue(false)
      // TODO: This method is undefined
      // saveState({loginJwt: Config.awsCognitoJWTHashForTest, isAuthenticated: true}, 'jwtAuth')
      const component = renderEditorRoute("/editor")
      expect(component.find(ImportResourceTemplate).length).toEqual(1)
    })

    // TODO: needs fixing for re-done authN approach, see #528
    it.skip('/templates renders the Login component (with location props) if the user is not authenticated', () => {
      // TODO: This method is undefined
      // saveState({loginJwt: {}, isAuthenticated: false}, 'jwtAuth')
      // const component = renderRoutes("/templates")
      // TODO: Login is not defined or imported
      // expect(component.find(Login).length).toEqual(1)
      // expect(component.find(Login).prop('location')).toBeDefined()
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
  //   it('/templates renders the Import component if user is authenticated', () => {
  //     const component = renderRoutes("/templates").setProps({jwtAuth:{isAuthenticated: true}})
  //     console.warn(component.props())
  //     component.update()
  //     expect(component.find(ImportResourceTemplate).length).toEqual(1)
  //   })
  // })

})
