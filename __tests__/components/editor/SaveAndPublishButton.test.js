// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import SaveAndPublishButton from 'components/editor/SaveAndPublishButton'
import Button from 'react-bootstrap/lib/Button'

describe('<SaveAndPublishButton />', () => {
  const mockSave = jest.fn()
  describe('when disabled', () => {
    const wrapper = shallow(<SaveAndPublishButton.WrappedComponent isDisabled={true} save={mockSave}/>)
    it('the button is disabled', () => {
      expect(wrapper.find(Button).prop('disabled')).toEqual(true)
    })
  })
  describe('when not disabled', () => {
    const wrapper = shallow(<SaveAndPublishButton.WrappedComponent isDisabled={false} save={mockSave}/>)
    it('the button is not disabled', () => {
      expect(wrapper.find(Button).prop('disabled')).toEqual(false)
    })
  })
  describe('clicking the button', () => {
    const wrapper = shallow(<SaveAndPublishButton.WrappedComponent isDisabled={false} save={mockSave} isSaved={false} currentUser="Wilford Brimley" />)
    it('calls save', () => {
      wrapper.find(Button).simulate('click')
      expect(mockSave).toHaveBeenCalledWith(false, 'Wilford Brimley')
    })
  })
})
