// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import LoadResource from 'components/load/LoadResource'
import LoadByURIForm from 'components/load/LoadByURIForm'
import LoadByRDFForm from 'components/load/LoadByRDFForm'

describe('<LoadResource />', () => {
  const wrapper = shallow(<LoadResource.WrappedComponent />)

  it('renders a LoadByURIForm', () => {
    expect(wrapper.find(LoadByURIForm)).toBeTruthy()
  })

  it('renders a LoadByRDFForm', () => {
    expect(wrapper.find(LoadByRDFForm)).toBeTruthy()
  })
})
