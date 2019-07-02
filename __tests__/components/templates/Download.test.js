// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Download from 'components/templates/Download'

describe('<Download />', () => {
  it('has a download link', () => {
    const wrapper = shallow(<Download filename="example.json" blob={ {} }/>)

    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.find('button').text()).toEqual('Download')
  })

  describe('onClick', () => {
    const mockBlob = { data: 'abc123' }
    const filename = 'example.json'
    const wrapper = shallow(<Download filename={ filename } blob={ mockBlob }/>)

    const handleFileDownloadSpy = jest.spyOn(wrapper.instance(), 'handleFileDownload')
    wrapper.find('button').simulate('click')
    expect(handleFileDownloadSpy).toHaveBeenCalledTimes(1)
    expect(handleFileDownloadSpy).toHaveBeenCalledWith(mockBlob, filename)
  })
})
