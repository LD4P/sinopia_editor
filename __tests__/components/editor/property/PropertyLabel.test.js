// Copyright 2019 Stanford University see Apache2.txt for license

import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import PropertyLabel from 'components/editor/property/PropertyLabel'
import { OverlayTrigger } from 'react-bootstrap'
import RequiredSuperscript from 'components/editor/property/RequiredSuperscript'


describe('<PropertyLabel />', () => {
  describe('when the propertyTemplate has a remark with a URL', () => {
    const props = {
      propertyTemplate: {
        remark: 'http://access.rdatoolkit.org/example',
        propertyLabel: 'Example RDA',
      },
    }
    const wrapper = shallow(<PropertyLabel {...props} />)

    it('displays an HTML anchor tag if there is a URL in a property remark', () => {
      expect(wrapper.find('a')).toBeTruthy()
    })

    it('contains a href with the value of the remark', () => {
      const anchor = wrapper.find('a')

      expect(anchor.prop('href')).toEqual(new URL('http://access.rdatoolkit.org/example'))
    })

    it('contains a span within the link with the text value of the label', () => {
      const span = wrapper.find('a > span')

      expect(span.text()).toEqual('Example RDA')
    })
  })

  describe('when the propertyTemplate has a remark and label, and the remark is not a URL', () => {
    const props = {
      propertyTemplate: {
        remark: 'A test remark',
        propertyLabel: 'Example RDA',
      },
    }

    const wrapper = shallow(<PropertyLabel {...props} />)

    it('displays a tooltip from the label if the remark is not a valid URL', () => {
      expect(wrapper.find(OverlayTrigger).length).toEqual(1)
      expect(wrapper.find('OverlayTrigger span').text()).toEqual('Example RDA')
    })
  })


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

  describe('when the propertyTemplate has an empty string as a remark and just a label', () => {
    const props = {
      propertyTemplate: {
        propertyLabel: 'Example RDA',
        remark: '',
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
