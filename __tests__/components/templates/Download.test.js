// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import Download from 'components/templates/Download'

describe('<Download />', () => {
  const groupName = 'Stanford'
  const resourceTemplateId = 'myOrg:myRt'
  it('has a download link', () => {
    const wrapper = shallow(<Download groupName={groupName} resourceTemplateId={resourceTemplateId} />)

    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.find('button').text()).toEqual('<FontAwesomeIcon />')
  })

  // Note: Difficult to test download behavior because uses Blob, which is available in browser but not node.
})
