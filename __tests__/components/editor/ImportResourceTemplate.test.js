// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import ImportResourceTemplate from '../../../src/components/editor/ImportResourceTemplate'
import ImportFileZone from '../../../src/components/editor/ImportFileZone'

describe('<ImportResourceTemplate />', () => {
  const wrapper = shallow(<ImportResourceTemplate />)
  //This test should be expanded when the Import Resource Template page is further defined
  it('contains the main div', () => {
    expect(wrapper.find("div#importResourceTemplate").length).toBe(1)
  })

  it('contains the place to import a file', () => {
    expect(wrapper.find(ImportFileZone).length).toBe(1)
  })

})