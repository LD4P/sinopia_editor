// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import LoadByRDFForm from 'components/load/LoadByRDFForm'
/* eslint import/namespace: 'off' */
import * as utils from 'Utilities'

const mockState = { foo: 'bar' }
jest.mock('ResourceStateBuilder', () => {
  return jest.fn().mockImplementation(() => {
    return { state: mockState }
  })
})

describe('<LoadByRDFForm />', () => {
  const mockExistingResource = jest.fn()
  const n3 = 'not rdf'

  const wrapper = shallow(<LoadByRDFForm.WrappedComponent existingResource={mockExistingResource} />)

  it('renders an input (baseUri)', () => {
    expect(wrapper.find('input').length).toEqual(1)
  })

  it('renders an textarea (N3)', () => {
    expect(wrapper.find('textarea').length).toEqual(1)
  })

  it('renders a submit button', () => {
    expect(wrapper.find('button[type="submit"]').length).toEqual(1)
  })

  describe('when n3 is not provided', () => {
    it('does nothing when submit is clicked', () => {
      wrapper.find('form').simulate('submit', { preventDefault: jest.fn() })
      expect(mockExistingResource).not.toBeCalled()
    })
  })

  describe('when n3 is provided', () => {
    it('calls existingResource when submit is clicked', async () => {
      utils.rdfDatasetFromN3 = jest.fn().mockResolvedValue([])
      wrapper.find('textarea').simulate('change', { target: { value: n3 }, preventDefault: jest.fn() })
      await wrapper.find('form').simulate('submit', { preventDefault: jest.fn() })
      expect(mockExistingResource).toBeCalledWith(mockState)
    })
  })
})
