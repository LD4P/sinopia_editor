// Copyright 2019 Stanford University see Apache2.txt for license

import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import PropertyLabel from '../../../src/components/editor/PropertyLabel'
import { OverlayTrigger } from 'react-bootstrap'
import RequiredSuperscript from '../../../src/components/editor/RequiredSuperscript'


describe('<PropertyLabel />', () => {

  describe('when the propertyTemplate has a remark with a URL', () => {
    const props = {
      "pt" : {
        remark: "http://access.rdatoolkit.org/example",
        propertyLabel: "Example RDA"
      }
    }
    const wrapper = shallow(<PropertyLabel {...props} />)

    it('displays an HTML anchor tag if there is a URL in a property remark', () => {
      expect(wrapper.find('a')).toBeTruthy()
    })

    it('contains a href with the value of the remark', () => {
      const anchor = wrapper.find('a')
      expect(anchor.prop('href')).toEqual(new URL("http://access.rdatoolkit.org/example"))
    })

    it('contains a span within the link with the text value of the label', () => {
      const span = wrapper.find('a > span')
      expect(span.text()).toEqual("Example RDA")
    })

    it('does not has the RequiredSuperscript component if property: mandatory is false', () => {
      expect(wrapper.find(RequiredSuperscript).length).toEqual(0)
    })

  })

  describe('when the propertyTemplate has a remark and label, and the remark is not a URL', () => {
    const props = {
      "pt" : {
        remark: "A test remark",
        propertyLabel: "Example RDA"
      }
    }

    const wrapper = shallow(<PropertyLabel {...props} />)

    it('displays a tooltip from the label if the remark is not a valid URL', () => {
      expect(wrapper.find(OverlayTrigger).length).toEqual(1)
      expect(wrapper.find('OverlayTrigger span').text()).toEqual("Example RDA")
    })

  })


  describe('when the propertyTemplate has no remark and just a label', () => {
    const props = {
      "pt" : {
        propertyLabel: "Example RDA"
      }
    }
    const wrapper = shallow(<PropertyLabel {...props} />)

    it('displays only a span with the property label as the panel title', () => {
      expect(wrapper.find('span').text()).toEqual("Example RDA")
    })

  })

  describe('when the propertyTemplaye has mandatory" true', () => {
    const propsWithRequired = {
      "pt" : {
        remark: "http://access.rdatoolkit.org/example",
        propertyLabel: "Example RDA",
        mandatory: "true"
      }
    }
    const wrapperWithRequired = shallow(<PropertyLabel {...propsWithRequired} />)

    it('has the RequiredSuperscript component if property: mandatory is true', () => {
      expect(wrapperWithRequired.find(RequiredSuperscript).length).toEqual(1)
    })
  })

})
