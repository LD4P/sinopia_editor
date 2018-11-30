// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import { shallow } from 'enzyme'
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
      "type": "lookup"
    },
    {
      "propertyLabel": "Bullseye!",
      "type": "target"
    },
    {
      "propertyLabel": "Chain chain chains",
      "type": "resource",
      "valueConstraint": {
        "valueTemplateRefs": [
          "resourceTemplate:bf2:Note"
        ]
      }
    },
    {
      "propertyLabel": "YAM (yet another modal)",
      "type": "resource",
      "valueConstraint": {
        "valueTemplateRefs": [
          "resourceTemplate:bf2:Note"
        ]
      }
    }
  ]
}

describe('<ResourceTemplateForm />', () => {
  const wrapper = shallow(<ResourceTemplateForm {...rtProps} />)

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
      .find('div.ResourceTemplateForm InputLiteral').length)
      .toEqual(1)
  })

  it('renders InputTarget nested component (b/c we have a property of type "target")', () => {
    expect(wrapper
      .find('div.ResourceTemplateForm InputTarget').length)
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
  })

  it('renders error text when there are no propertyTemplates', () => {
    const myWrap = shallow(<ResourceTemplateForm propertyTemplates={[]} />)
    const errorEl = myWrap.find('h1')
    expect(errorEl).toHaveLength(1)
    expect(errorEl.text()).toEqual('There are no propertyTemplates - probably an error.')
  })

  it('<form> does not contain redundant form attribute', () => {
    expect(wrapper.find('form[role="form"]').length).toEqual(0)
  })
})
