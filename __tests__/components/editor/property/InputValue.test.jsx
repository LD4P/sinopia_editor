// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import InputValue from 'components/editor/property/InputValue'

describe('<InputValue>', () => {
  let itemsChangeFn
  let removeDataFn
  let mockWrapper

  beforeEach(() => {
    itemsChangeFn = jest.fn()
    removeDataFn = jest.fn()

    mockWrapper = shallow(<InputValue.WrappedComponent item={{ content: 'foo', lang: 'en' }}
                                                       reduxPath={[
                                                         'resourceTemplate:bf2:Monograph:Instance',
                                                         'http://id.loc.gov/ontologies/bibframe/instanceOf',
                                                       ]}
                                                       handleEdit={itemsChangeFn}
                                                       removeItem={removeDataFn} />)
  })

  describe('when passed a literal value', () => {
    it('it draws the LanguageButton', () => {
      expect(mockWrapper.find('div#userInput').text()).toEqual('foo×Edit') // Contains × and Edit as buttons
    })
  })

  describe('when passed a uri value', () => {
    beforeEach(() => {
      mockWrapper = shallow(<InputValue.WrappedComponent item={{ uri: 'http://example.com' }}
                                                         reduxPath={[
                                                           'resourceTemplate:bf2:Monograph:Instance',
                                                           'http://id.loc.gov/ontologies/bibframe/instanceOf',
                                                         ]}
                                                         handleEdit={itemsChangeFn}
                                                         removeItem={removeDataFn} />)
    })

    it('it draws the item', () => {
      expect(mockWrapper.find('div#userInput').text()).toEqual('http://example.com×Edit') // Contains × and Edit as buttons
    })
  })

  it('calls the removeMockDataFn when X is clicked', () => {
    mockWrapper.find('button.close').first().simulate('click', { target: { dataset: { item: 5 } } })
    expect(removeDataFn).toHaveBeenCalled()
  })

  it('calls the removeMockDataFn and mockItemsChange when Edit is clicked', () => {
    mockWrapper.find('button#editItem').first().simulate('click', { target: { dataset: { item: 5 } } })
    expect(removeDataFn).toHaveBeenCalled()
    expect(itemsChangeFn).toHaveBeenCalledWith('foo', 'en')
  })
})
