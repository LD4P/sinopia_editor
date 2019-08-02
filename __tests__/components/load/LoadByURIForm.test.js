// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import LoadByURIForm from 'components/load/LoadByURIForm'

describe('<LoadByURIForm />', () => {
  const mockLoadResource = jest.fn()
  const user = { name: 'Ludwig Wittgenstein' }
  const uri = 'http://localhost:8080/repository/stanford/fe99a7d9'
  const wrapper = shallow(<LoadByURIForm.WrappedComponent retrieveResource={mockLoadResource} currentUser={user} />)

  it('renders an input box', () => {
    expect(wrapper.find('input').length).toEqual(1)
  })

  it('renders a submit button', () => {
    expect(wrapper.find('button[type="submit"]').length).toEqual(1)
  })

  describe('when uri is not provided', () => {
    it('does nothing when submit is clicked', () => {
      wrapper.find('form').simulate('submit', { preventDefault: jest.fn() })
      expect(mockLoadResource).not.toBeCalled()
    })
  })

  describe('when uri is provided', () => {
    it('calls loadResource when submit is clicked', () => {
      wrapper.find('input').simulate('change', { target: { value: uri }, preventDefault: jest.fn() })
      wrapper.find('form').simulate('submit', { preventDefault: jest.fn() })
      expect(mockLoadResource).toBeCalledWith(user, uri)
    })
  })
})
