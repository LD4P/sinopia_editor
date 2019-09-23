// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyLabel from 'components/editor/property/PropertyLabel'
import RequiredSuperscript from 'components/editor/property/RequiredSuperscript'


describe('<PropertyLabel />', () => {
  describe('when the propertyTemplate has no remark and just a label', () => {
    const props = {
      propertyTemplate: {
        propertyLabel: 'Example RDA',
      },
    }
    const wrapper = shallow(<PropertyLabel {...props} />)

    it('displays only a span with the property label as the panel title', () => {
      expect(wrapper.find('span').text()).toEqual('Example RDA')
    })
  })

  describe('the propertyTemplate mandatory property', () => {
    const props = {
      propertyTemplate: {
        remark: 'http://access.rdatoolkit.org/example',
        propertyLabel: 'Example RDA',
      },
    }

    it('does not have the RequiredSuperscript component if property: mandatory is undefined', () => {
      const wrapperNoRequired = shallow(<PropertyLabel {...props} />)

      expect(wrapperNoRequired.find(RequiredSuperscript).length).toEqual(0)
    })

    it('does not have the RequiredSuperscript component if property: mandatory is false', () => {
      props.propertyTemplate.mandatory = 'false'
      const wrapperNoRequired = shallow(<PropertyLabel {...props} />)

      expect(wrapperNoRequired.find(RequiredSuperscript).length).toEqual(0)
    })

    it('has the RequiredSuperscript component if property: mandatory is true', () => {
      props.propertyTemplate.mandatory = 'true'
      const wrapperRequired = shallow(<PropertyLabel {...props} />)

      expect(wrapperRequired.find(RequiredSuperscript).length).toEqual(1)
    })
  })
})
