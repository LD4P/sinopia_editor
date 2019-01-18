// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import Header from '../../../src/components/editor/Header'

describe('<Header />', () => {
  const wrapper = shallow(<Header />)

  it ('displays the Sinopia text', () => {
    expect(wrapper.find("h1.editor-logo").text()).toBe("LINKED DATA EDITOR")
  })

})
