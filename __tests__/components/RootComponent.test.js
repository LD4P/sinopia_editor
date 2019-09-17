// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import { OffCanvas } from 'react-offcanvas'
import { Provider } from 'react-redux'
import RootContainer from 'components/RootContainer'

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
