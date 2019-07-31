// Copyright 2019 Stanford University see Apache2.txt for license

import 'jsdom-global/register'
import React from 'react'
import { shallow } from 'enzyme'
import PropertyLabelInfo from 'components/editor/property/PropertyLabelInfo'

describe('<PropertyLabelInfo />', () => {
  describe('when the propertyTemplate has a remark with a URL', () => {
    const props = {
      propertyTemplate: {
        remark: 'http://access.rdatoolkit.org/example',
        propertyLabel: 'Example RDA',
      },
    }
    const wrapper = shallow(<PropertyLabelInfo {...props} />)

    it('renders a PropertyLabelInfoLink', () => {
      expect(wrapper.exists('PropertyLabelInfoLink')).toBe(true)
    })

    it('does not render a PropertyLabelInfoTooltip', () => {
      expect(wrapper.exists('PropertyLabelInfoTooltip')).toBe(false)
    })
  })

  describe('when the propertyTemplate has a remark and label, and the remark is not a URL', () => {
    const props = {
      propertyTemplate: {
        remark: 'A test remark',
        propertyLabel: 'Example RDA',
      },
    }

    const wrapper = shallow(<PropertyLabelInfo {...props} />)

    it('renders a PropertyLabelInfoTooltip', () => {
      expect(wrapper.exists('PropertyLabelInfoTooltip')).toBe(true)
    })

    it('does not render a PropertyLabelInfoLink', () => {
      expect(wrapper.exists('PropertyLabelInfoLink')).toBe(false)
    })
  })


  describe('when the propertyTemplate has no remark and just a label', () => {
    const props = {
      propertyTemplate: {
        propertyLabel: 'Example RDA',
      },
    }
    const wrapper = shallow(<PropertyLabelInfo {...props} />)

    it('does not render a PropertyLabelInfoTooltip', () => {
      expect(wrapper.exists('PropertyLabelInfoTooltip')).toBe(false)
    })

    it('does not render a PropertyLabelInfoLink', () => {
      expect(wrapper.exists('PropertyLabelInfoLink')).toBe(false)
    })
  })

  describe('when the propertyTemplate has an empty string as a remark and just a label', () => {
    const props = {
      propertyTemplate: {
        propertyLabel: 'Example RDA',
        remark: '',
      },
    }
    const wrapper = shallow(<PropertyLabelInfo {...props} />)

    it('does not render a PropertyLabelInfoTooltip', () => {
      expect(wrapper.exists('PropertyLabelInfoTooltip')).toBe(false)
    })

    it('does not render a PropertyLabelInfoLink', () => {
      expect(wrapper.exists('PropertyLabelInfoLink')).toBe(false)
    })
  })
})
