// Copyright 2019 Stanford University see LICENSE for license

import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import InputLookupDataList from 'components/editor/property/InputLookupDataList'

describe('<InputLookupDataList />', () => {
  const wrapper = shallow(<InputLookupDataList.WrappedComponent />)

  it('default component', () => {
    console.warn(wrapper)
    expect(wrapper)
  })
})
