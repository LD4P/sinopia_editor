import 'jsdom-global/register'
import React from 'react'
import { shallow } from "enzyme"
import { MemoryRouter } from "react-router"
import RootContainer from '../../src/components/RootContainer'
import { OffCanvas } from 'react-offcanvas'
import { Provider } from 'react-redux'

describe('<RootComponent />', () => {
  const wrapper = shallow(<RootContainer/>)

  it('renders the home-page div', () => {
    expect(wrapper.find('div#home-page').length).toEqual(1)
  })

  it('contains the OffCanvas component', () => {
    expect(wrapper.find(OffCanvas)).toHaveLength(1)
  })

  it('wraps the App in a store Provider', () => {
    expect(wrapper.find(Provider)).toHaveLength(1)
  })
})
