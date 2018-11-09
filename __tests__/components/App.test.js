import 'jsdom-global/register'
import React from 'react'
import { mount, shallow } from "enzyme"
import { MemoryRouter } from "react-router"
import App from '../../src/components/App'
import HomePage from '../../src/components/HomePage'
import Editor from '../../src/components/editor/Editor'
import Footer from '../../src/components/Footer'


describe('<App />', () =>{
  const wrapper = shallow(<App />)
  it('selectable by id "#app"', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('div#app').length).toEqual(1)
  })
  it('renders <Footer />', () => {
    expect(wrapper.find(Footer).length).toBe(1)
  })
})

describe("#routes", () => {
  const renderRoutes = path =>
    mount(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    )

  it("root renders HomePage component", () => {
    const component = renderRoutes("/")
    expect(component.find(HomePage).length).toEqual(1)
  })

  it("/editor renders Editor component", () => {
    const component = renderRoutes("/editor")
    expect(component.find(Editor).length).toEqual(1)
  })

  it("invalid path renders a 404", () => {
    const component = renderRoutes("/blah")
    expect(component.contains(<h1>404</h1>)).toEqual(true)
  })
})
