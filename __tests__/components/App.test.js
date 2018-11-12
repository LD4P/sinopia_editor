/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
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
