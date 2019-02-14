// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import Browse from '../../../src/components/editor/Browse'

describe('<Browse />', () => {
  const wrapper = shallow(<Browse />)
  //This test should be expanded when the Browse page is further defined
  it ('contains the main div', () => {
    expect(wrapper.find("div#browse").length).toBe(1)
  })

})