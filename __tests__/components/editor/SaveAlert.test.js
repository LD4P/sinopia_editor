// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import SaveAlert from 'components/editor/SaveAlert'

describe('<SaveAlert />', () => {
  describe('when lastSave is undefined', () => {
    const wrapper = shallow(<SaveAlert.WrappedComponent skipTimer={true} />)
    wrapper.setProps({ lastSave: undefined })
    it('does not render', () => {
      expect(wrapper.exists('div.alert')).toBeFalsy()
    })
  })

  describe('when lastSave is defined', () => {
    const wrapper = shallow(<SaveAlert.WrappedComponent skipTimer={true} />)
    wrapper.setProps({ lastSave: 12345 })
    it('renders', () => {
      expect(wrapper.exists('div.alert')).toBeTruthy()
    })
  })
})
