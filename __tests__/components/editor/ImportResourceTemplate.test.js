// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import ImportResourceTemplate from '../../../src/components/editor/ImportResourceTemplate'

describe('<ImportResourceTemplate />', () => {
  const wrapper = shallow(<ImportResourceTemplate />)
  //This test should be expanded when the Import Resource Template page is further defined
  it ('contains the main div', () => {
    expect(wrapper.find("div#importResourceTemplate").length).toBe(1)
  })

})