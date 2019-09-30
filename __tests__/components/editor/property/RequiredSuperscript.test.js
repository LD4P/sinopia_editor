// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import RequiredSuperscript from 'components/editor/property/RequiredSuperscript'

describe('<RequiredSuperscript />', () => {
  const wrapper = shallow(<RequiredSuperscript />)

  it('displays a HTML <sup>', () => {
    expect(wrapper.find('sup')).toBeTruthy()
  })

  it('uses FontAwesome Asterisk', () => {
    expect(wrapper.find('sup > FontAwesomeIcon[className="asterick text-danger"]')).toBeTruthy()
  })
})
