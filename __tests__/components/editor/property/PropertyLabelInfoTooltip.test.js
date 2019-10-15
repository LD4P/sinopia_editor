// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyLabelInfoTooltip from 'components/editor/property/PropertyLabelInfoTooltip'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'


describe('<PropertyLabelInfoTooltip />', () => {
  const props = {
    propertyTemplate: {
      remark: 'A test remark',
      propertyLabel: 'Example RDA',
    },
  }

  const wrapper = shallow(<PropertyLabelInfoTooltip {...props} />)

  it('displays a tooltip from the label if the remark is not a valid URL', () => {
    expect(wrapper.find('div[data-html="true"]').length).toEqual(1)
  })

  it('renders an info icon', () => {
    expect(wrapper.find('FontAwesomeIcon').props().icon).toEqual(faInfoCircle)
  })
})
