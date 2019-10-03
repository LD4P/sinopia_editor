// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import SaveAndPublishButton from 'components/editor/SaveAndPublishButton'

describe('<SaveAndPublishButton />', () => {
  const mockSave = jest.fn()
  describe('when disabled', () => {
    const wrapper = shallow(<SaveAndPublishButton.WrappedComponent isDisabled={true} />)
    it('the button is disabled', () => {
      expect(wrapper.find('button').prop('disabled')).toEqual(true)
    })
  })
  describe('when not disabled', () => {
    const wrapper = shallow(<SaveAndPublishButton.WrappedComponent isDisabled={false} />)
    it('the button is not disabled', () => {
      expect(wrapper.find('button').prop('disabled')).toEqual(false)
    })
  })
  describe('clicking the button', () => {
    const user = { name: 'Wilford Brimley' }
    const wrapper = shallow(<SaveAndPublishButton.WrappedComponent isDisabled={false} showGroupChooser={mockSave} isSaved={false} currentUser={user} />)
    it('calls showGroupChooser', () => {
      wrapper.find('button').simulate('click')
      expect(mockSave).toHaveBeenCalledWith(true)
    })
  })
})
