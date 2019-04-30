// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import 'jsdom-global/register'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import { mount, shallow } from 'enzyme'
import InputLiteral from '../../../src/components/editor/InputLiteral'
import { ResourceTemplateForm } from '../../../src/components/editor/ResourceTemplateForm'

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

const mockResponse = (status, statusText, response) => {
  return new Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  }).body
}

const responseBody = [{
  response: {
    body: {
      "id": "resourceTemplate:bf2:Note",
      "resourceURI": "http://id.loc.gov/ontologies/bibframe/Note",
      "resourceLabel": "Note",
      "propertyTemplates": [
        {
          "propertyURI": "http://www.w3.org/2000/01/rdf-schema#label",
          "propertyLabel": "Note",
          "mandatory": "false",
          "repeatable": "false",
          "type": "literal",
          "resourceTemplates": [],
          "valueConstraint": {
            "valueTemplateRefs": [],
            "useValuesFrom": [],
            "valueDataType": {},
            "editable": "true",
            "repeatable": "false",
            "defaults": []
          }
        }
      ]
    }
  }
}]

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
const mockHandleGenerateLD = jest.fn()

describe('<ResourceTemplateForm /> after fetching data from sinopia server', () => {

  const asyncCall = (index) => {
    const response = mockResponse(200, null, responseBody[index])
    return response
  }

  const promises = Promise.all([ asyncCall(0) ])

  const wrapper = shallow(
    <ResourceTemplateForm {...rtProps}
      resourceTemplate = {rtTest}
      handleGenerateRDF = {mockHandleGenerateLD}
      literals = {lits}
      lookups = {lups}
      rtId = {"resourceTemplate:bf2:Monograph:Instance"}
      parentResourceTemplate = {"resourceTemplate:bf2:Monograph:Instance"}
      generateLD = { ld }
    />
  )

  describe('configured component types', () => {
    const lookup = {
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
    }

    it('renders a lookup component', async () => {
      const instance = wrapper.instance()
      await instance.fullfillRTPromises(promises).then(() => wrapper.update()).then(() => {
        instance.configuredComponent(lookup, 1)
        expect(wrapper
          .find('div.ResourceTemplateForm Connect(InputLookupQA)').length)
          .toEqual(1)
      }).catch(e => {})
    })

    const list = {
      "propertyLabel": "What's the frequency Kenneth?",
      "type": "resource",
      "valueConstraint": {
        "useValuesFrom": [
          "https://id.loc.gov/vocabulary/frequencies"
        ]
      }
    }

    it('renders a list component', async () => {
      const instance = wrapper.instance()
      await instance.fullfillRTPromises(promises).then(() => wrapper.update()).then(() => {
        instance.configuredComponent(list, 1)
        expect(wrapper
          .find('div.ResourceTemplateForm Connect(InputListLOC)').length)
          .toEqual(1)
      }).catch(e => {})
    })
  })

  it('renders InputLiteral nested component (b/c we have a property of type "literal")', async () => {
    await wrapper.instance().fullfillRTPromises(promises).then(() => wrapper.update()).then(() => {
      expect(wrapper
        .find('div.ResourceTemplateForm Connect(InputLiteral)').length)
        .toEqual(1)
    }).catch(e => {})
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

describe('when there are no findable nested resource templates', () => {
  const asyncCall = () => {
    const response = mockResponse(200, null, undefined)
    return response
  }

  const promises = Promise.all([ asyncCall ])

  const wrapper = shallow(<ResourceTemplateForm
    propertyTemplates={[]}
    resourceTemplate = {rtTest}
    handleGenerateRDF = {mockHandleGenerateLD}
    literals = {lits}
    lookups = {lups}
    rtId = {"resourceTemplate:bf2:Monograph:Instance"}
    parentResourceTemplate = {"resourceTemplate:bf2:Monograph:Instance"}
    generateLD = { ld }
  />)

  it('renders error alert box', async () => {
    await wrapper.instance().fullfillRTPromises(promises).then(() => wrapper.update()).then(() => {
        expect(wrapper.state.errot).toBeTruthy()
        const errorEl = wrapper.find('div.alert')
        expect(errorEl).toHaveLength(1)
        expect(errorEl.text()).toEqual('Sinopia server is offline or has no resource templates to display')
    }).catch(e => {})
  })
})
