// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import shortid from 'shortid'
import LanguageButton from 'components/editor/property/LanguageButton'

describe('<LanguageButton />', () => {
  let mockWrapper

  shortid.generate = jest.fn().mockReturnValue(0)

  beforeEach(() => {
    mockWrapper = shallow(<LanguageButton.WrappedComponent
                                        reduxPath={[
                                          'resourceTemplate:bf2:Monograph:Instance',
                                          'http://id.loc.gov/ontologies/bibframe/instanceOf',
                                          'items',
                                          'TM1qwVFkh',
                                        ]}
                                        language={'English'}
                                        handleMyItemsLangChange={jest.fn()} />)
  })

  it('item appears when user inputs text into the field', () => {
    expect(mockWrapper.find('Button#language').childAt(1).text()).toEqual('English')
  })
})

describe('When the user enters input into language modal', () => {
  const mockMyItemsLangChange = jest.fn()

  shortid.generate = jest.fn().mockReturnValue(0)
  const mockWrapper = shallow(<LanguageButton.WrappedComponent
                                            reduxPath={[
                                              'resourceTemplate:bf2:Monograph:Instance',
                                              'http://id.loc.gov/ontologies/bibframe/instanceOf',
                                              'items',
                                              'TM1qwVFkh',
                                            ]}
                                            language={'English'}
                                            handleMyItemsLangChange={mockMyItemsLangChange} />)

  it('shows the <InputLang> modal when the <Button/> is clicked', () => {
    mockWrapper.find('Button').first().simulate('click')
    expect(mockWrapper.find('Modal').prop('show')).toEqual(true)
    expect(mockWrapper.find('ModalTitle').render().text()).toEqual('Languages')
  })

  it('calls handleLangSubmit when submit is clicked', () => {
    mockWrapper.find('Button').first().simulate('click')
    expect(mockWrapper.find('Modal').prop('show')).toEqual(true)
    expect(mockWrapper.find('Modal').length).toEqual(1)
    mockWrapper.find('ModalFooter').find('Button').first().simulate('click')
    expect(mockMyItemsLangChange.mock.calls.length).toEqual(1)
    expect(mockWrapper.find('Modal').length).toEqual(0)


    mockMyItemsLangChange.mock.calls = []
  })

  it('closes modal when close is clicked', () => {
    mockWrapper.find('Button').first().simulate('click')
    expect(mockWrapper.find('Modal').prop('show')).toEqual(true)
    mockWrapper.find('ModalFooter').find('Button').last().simulate('click')
    expect(mockMyItemsLangChange.mock.calls.length).toEqual(0)
    expect(mockWrapper.find('Modal').length).toEqual(0)

    mockMyItemsLangChange.mock.calls = []
  })
})
