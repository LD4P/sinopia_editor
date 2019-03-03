// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import { mount, shallow } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'
import ResourceTemplateForm from '../../../src/components/editor/ResourceTemplateForm'
import {generateLD} from "../../../src/reducers/linkedData";

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
          "https://id.loc.gov/vocabulary/frequencies"
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

// const lits = { id: 0, content: 'content' }
const lits =  {formData: [{id: 0, uri: 'http://uri', items: [
        {content: '12345', id: 0, bnode: {termType: 'BlankNode', value: 'n3-0'}, propPredicate: 'http://predicate'}
      ], rtId: 'resourceTemplate:bf2'}]}
const lups = { id: 'id', uri: 'uri', label: 'label' }
const ld = {
  "@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "bf": "http://id.loc.gov/ontologies/bibframe/",
    "bflc": "http://id.loc.gov/ontologies/bflc/",
    "madsrdf": "http://www.loc.gov/mads/rdf/v1#",
    "pmo": "http://performedmusicontology.org/ontology/"
  },
  "@graph": [
    {
      "@id": "n3-0",
      "@type": "http://id.loc.gov/ontologies/bibframe/Instance",
      "http://id.loc.gov/ontologies/bibframe/issuance": {
        "@id": "http://id.loc.gov/vocabulary/issuance/mono"
      },
      "http://id.loc.gov/ontologies/bibframe/carrier": {
        "@id": "http://id.loc.gov/vocabulary/carriers/nc"
      },
      "http://id.loc.gov/ontologies/bibframe/responsibilityStatement": "STMT",
      "http://id.loc.gov/ontologies/bibframe/note": {
        "@id": "n3-8"
      }
    },
    {
      "@id": "http://id.loc.gov/vocabulary/issuance/mono",
      "@type": "http://id.loc.gov/ontologies/bibframe/issuance",
      "rdfs:label": "single unit"
    },
    {
      "@id": "http://id.loc.gov/vocabulary/carriers/nc",
      "@type": "http://id.loc.gov/ontologies/bibframe/carrier",
      "rdfs:label": "volume"
    },
    {
      "@id": "n3-8",
      "@type": "http://id.loc.gov/ontologies/bibframe/Note",
      "http://www.w3.org/2000/01/rdf-schema#label": "NOTE"
    }
  ]
}

const rtTest = { resourceURI: "http://id.loc.gov/ontologies/bibframe/Work" }

describe('<ResourceTemplateForm />', () => {
  const mockHandleGenerateLD = jest.fn()
  const wrapper = shallow(<ResourceTemplateForm.WrappedComponent
    {...rtProps}
    resourceTemplate = {rtTest}
    handleGenerateRDF = {mockHandleGenerateLD}
    literals = {lits}
    lookups = {lups}
    rtId = {"resourceTemplate:bf2:Monograph:Instance"}
    parentResourceTemplate = {"resourceTemplate:bf2:Monograph:Instance"}
    generateLD = { ld }
  />)

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

  // TODO: Move this describe to when we are testing the Editor Header

  it('renders error text when there are no propertyTemplates', () => {
    const myWrap = shallow(<ResourceTemplateForm.WrappedComponent
      propertyTemplates={[]}
      resourceTemplate = {rtTest}
      handleGenerateRDF = {mockHandleGenerateLD}
      literals = {lits}
      lookups = {lups}
      rtId = {"resourceTemplate:bf2:Monograph:Instance"}
      parentResourceTemplate = {"resourceTemplate:bf2:Monograph:Instance"}
      generateLD = { ld }
    />)
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
