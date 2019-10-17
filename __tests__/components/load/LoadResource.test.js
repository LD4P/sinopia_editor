// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import LoadResource from 'components/load/LoadResource'
import LoadByRDFForm from 'components/load/LoadByRDFForm'

describe('<LoadResource />', () => {
  const wrapper = shallow(<LoadResource history={{}} />)

  it('renders a LoadByRDFForm', () => {
    expect(wrapper.find(LoadByRDFForm)).toBeTruthy()
  })
})
