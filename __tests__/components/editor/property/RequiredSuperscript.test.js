// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import { OverlayTrigger } from 'react-bootstrap'
import RequiredSuperscript from 'components/editor/property/RequiredSuperscript'

describe('<RequiredSuperscript />', () => {
  const wrapper = shallow(<RequiredSuperscript />)

  it('displays a HTML <sup>', () => {
    expect(wrapper.find('sup')).toBeTruthy()
  })

  it('uses FontAwesome Asterisk', () => {
    expect(wrapper.find('sup > FontAwesomeIcon[className="asterick text-danger"]')).toBeTruthy()
  })

  it('has an OverlayTrigger for the asterick (that displays a popover tooltip)', () => {
    expect(wrapper.find(OverlayTrigger).length).toEqual(1)
    expect(wrapper.find('OverlayTrigger FontAwesomeIcon').prop('className')).toEqual('asterick text-danger')
  })
})
