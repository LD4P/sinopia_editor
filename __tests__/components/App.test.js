import 'jsdom-global/register'
import React from 'react'
import { mount, shallow } from "enzyme"
import { MemoryRouter } from "react-router"
import App from '../../src/components/App'
import HomePage from '../../src/components/HomePage'
import Editor from '../../src/components/editor/Editor'


describe('<App />', () =>{
  it('selectable by id "#app"', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('div#app')).toBeDefined()
  })
})

describe("#routes", () => {
  const renderRoutes = path =>
    mount(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    )

  it("renders home page at root", () => {
    const component = renderRoutes("/")
    expect(component.find(HomePage)).toBeDefined()
  })

  it("renders the editor page", () => {
    const component = renderRoutes("/editor")
    expect(component.find(Editor)).toBeDefined()
  })

  it("renders a 404", () => {
    const component = renderRoutes("/blah")
    expect(component.contains(<h1>404</h1>)).toEqual(true)
  })
})
