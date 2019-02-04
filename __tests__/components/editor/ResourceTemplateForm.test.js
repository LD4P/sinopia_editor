// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import { mount, shallow } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'
import ModalToggle from '../../../src/components/editor/ModalToggle'
import ResourceTemplateForm from '../../../src/components/editor/ResourceTemplateForm'

const rtProps = {
  "propertyTemplates": [
    {
      "propertyLabel": "Literally",
      "type": "literal"
    },
    {
      "propertyLabel": "Look up, look down",
      "type": "lookup",
      "editable": "do not override me!",
      "repeatable": "do not override me!",
      "mandatory": "do not override me!",
      "valueConstraint": {
        "useValuesFrom": [
          "urn:ld4p:qa:names:person"
        ]
      }
    },
    {
      "propertyLabel": "What's the frequency Kenneth?",
      "type": "resource",
      "valueConstraint": {
        "useValuesFrom": [
          "http://id.loc.gov/vocabulary/frequencies"
        ]
      }
    },
    {
      "propertyLabel": "Chain chain chains",
      "type": "resource",
      "valueConstraint": {
        "valueTemplateRefs": [
          "resourceTemplate:bf2:Note"
        ]
      },
      "mandatory": "true"
    },
    {
      "propertyLabel": "YAM (yet another modal)",
      "type": "resource",
      "valueConstraint": {
        "valueTemplateRefs": [
          "resourceTemplate:bf2:Note"
        ]
      }
    },
    {
      "propertyLabel": "Non-modal resource",
      "type": "resource"
    }
  ]
}

describe('<ResourceTemplateForm />', () => {
  const mockHandleGenerateRDF = jest.fn()
  const wrapper = shallow(<ResourceTemplateForm.WrappedComponent
    {...rtProps}
    handleGenerateRDF = {mockHandleGenerateRDF} />)

  it('renders the ResourceTemplateForm text nodes', () => {
    wrapper.find('div.ResourceTemplateForm > p').forEach((node) => {
      expect(node.containsAnyMatchingElements([
        'BEGIN ResourceTemplateForm',
        'END ResourceTemplateForm'
      ]))
    })
  })

  it('renders InputLiteral nested component (b/c we have a property of type "literal")', () => {
    expect(wrapper
      .find('div.ResourceTemplateForm Connect(InputLiteral)').length)
      .toEqual(1)
  })

  it('renders the InputLookup nested component (b/c we have a property of type "lookup")', () => {
    expect(wrapper
      .find('div.ResourceTemplateForm Connect(InputLookupQA)').length)
      .toEqual(1)
  })

  it('renders InputResource nested component (b/c we have a property of type "resource" with a "useValuesFrom" value)', () => {
    expect(wrapper
      .find('div.ResourceTemplateForm Connect(InputListLOC)').length)
      .toEqual(1)
  })

  describe('buttons for resource template modals (b/c we have a property of type "resource" with correct valueTemplateRefs)', () => {
    it('renders ButtonToolbar containing ModalToggle(s)', () => {
      expect(wrapper
        .find('div.ResourceTemplateForm ButtonToolbar ModalToggle').length)
        .toEqual(2)
    })
    it('passes appropriate props to ModalToggle(s)', () => {
      wrapper.find('ModalToggle').forEach((node) => {
        expect(node.prop('buttonLabel')).toEqual('Note')
        expect(node.prop('rtId')).toEqual('resourceTemplate:bf2:Note')
        expect(node.prop('propertyTemplates')).toBeInstanceOf(Array)
      })
    })
    it('displays a FontAwesome Asterisk for a mandatory property', () => {
      wrapper.find('div.ResourceTemplateForm ButtonToolbar > div > b > sup').forEach((node) => {
        expect(node.text()).toBe("<FontAwesomeIcon />")
      })
    })

  })

  describe('a generate RDF button', () => {
    const rtTest = { resourceURI: "http://id.loc.gov/ontologies/bibframe/Work" }
    const rdf_wrapper = shallow(<ResourceTemplateForm.WrappedComponent
      {...rtProps}
      resourceTemplate = {rtTest}
      handleGenerateRDF = {mockHandleGenerateRDF} />)
    it('renders a Preview RDF button', () =>{
      expect(rdf_wrapper
        .find('div > button.btn-success').length)
        .toEqual(1)
    })
    it('displays a pop-up alert when clicked', () => {
      rdf_wrapper.find('div > button.btn-success').simulate('click')
      expect(mockHandleGenerateRDF.mock.calls.length).toBe(1)
    })
  })

  it('renders error text when there are no propertyTemplates', () => {
    const myWrap = shallow(<ResourceTemplateForm.WrappedComponent propertyTemplates={[]} />)
    const errorEl = myWrap.find('h1')
    expect(errorEl).toHaveLength(1)
    expect(errorEl.text()).toEqual('There are no propertyTemplates - probably an error.')
  })

  it('<form> does not contain redundant form attribute', () => {
    expect(wrapper.find('form[role="form"]').length).toEqual(0)
  })

  it('sets mandatory, editable and repeatable to the default values, if they are not specified', () => {
    wrapper.instance().defaultValues()
    wrapper.instance().forceUpdate()
    expect(rtProps.propertyTemplates[0].mandatory).toBe("true")
    expect(rtProps.propertyTemplates[0].repeatable).toBe("false")
    expect(rtProps.propertyTemplates[0].editable).toBe("true")
  })

  it('does not override "mandatory", "repeatable", or "editable" that has already been specified', () => {
    wrapper.instance().defaultValues()
    wrapper.instance().forceUpdate()
    expect(rtProps.propertyTemplates[1].mandatory).toBe("do not override me!")
    expect(rtProps.propertyTemplates[1].repeatable).toBe("do not override me!")
    expect(rtProps.propertyTemplates[1].editable).toBe("do not override me!")
  })

  it('displays a PropertyRemark when a remark is present', () => {
    wrapper.instance().props.propertyTemplates[2].remark = "https://www.youtube.com/watch?v=jWkMhCLkVOg"
    wrapper.instance().forceUpdate()
    const propertyRemark = wrapper.find('label > PropertyRemark')
    expect(propertyRemark).toBeTruthy()
  })
})
