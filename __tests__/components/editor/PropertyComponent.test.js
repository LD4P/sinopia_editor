// Copyright 2019 Stanford University see Apache2.txt for license

import React from 'react'
import { shallow } from 'enzyme'
import PropertyComponent from "../../../src/components/editor/PropertyComponent"

describe('<PropertyComponent />', () => {

  describe('sets the configuration state based on values from the property template', () => {

    describe('for templates configured as list', () => {
      const template = {
        "propertyURI": "http://id.loc.gov/ontologies/bibframe/issuance",
        "type": "resource",
        "valueConstraint": {
          "useValuesFrom": [
            "https://id.loc.gov/vocabulary/issuance"
          ]
        }
      }

      const wrapper = shallow(<PropertyComponent propertyTemplate={template} />)

      it('should find a configuration object in the lookup config', () => {
        expect(typeof wrapper.state('configuration')).toEqual("object")
        expect(wrapper.state('configuration').length).toEqual(1)
      })

      it('the configuration should be a component:list', () => {
        expect(wrapper.state('configuration')[0].component).toEqual('list')
      })

      it('it renders the list component', () => {
        expect(wrapper.find('Connect(InputListLOC)').length).toEqual(1)
      })

    })

    describe('for templates configured as lookup', () => {
      const template = {
        "propertyURI": "http://id.loc.gov/ontologies/bibframe/contribution",
        "type": "lookup",
        "valueConstraint": {
          "useValuesFrom": [
            "urn:ld4p:qa:names:person",
            "urn:ld4p:qa:subjects:person"
          ]
        }
      }

      const wrapper = shallow(<PropertyComponent propertyTemplate={template} />)

      it('should find a configuration object in the lookup config', () => {
        expect(typeof wrapper.state('configuration')).toEqual("object")
        expect(wrapper.state('configuration').length).toEqual(2)
      })

      it('the configuration should be a component:lookup', () => {
        expect(wrapper.state('configuration')[0].component).toEqual('lookup')
      })

      it('it renders the lookup component', () => {
        expect(wrapper.find('Connect(InputLookupQA)').length).toEqual(1)
      })

    })
  })

  describe('when there are no configuration values from the property template', () => {

    describe('for unconfigured templates of type:literal', () => {
      const template = {
        "propertyURI": "http://id.loc.gov/ontologies/bibframe/heldBy",
        "type": "literal"
      }

      const wrapper = shallow(<PropertyComponent propertyTemplate={template} />)

      it('the config will be undefined', () => {
        expect(wrapper.state('configuration').length).toEqual(0)
      })

      it('it will check for a property type of literal and render InputLiteral component', () => {
        expect(wrapper.find('Connect(InputLiteral)').length).toEqual(1)
      })

    })

    it('if the property type is not literal (i.e. resource) an empty div is returned', () => {
      const template = {
        "propertyURI": "http://id.loc.gov/ontologies/bibframe/note",
        "type": "resource",
        "valueConstraint": {
          "valueTemplateRefs": [
            "resourceTemplate:bf2:Note"
          ],
          "useValuesFrom": []
        }
      }

      const wrapper = shallow(<PropertyComponent propertyTemplate={template} />)
      expect(wrapper.find('Connect(InputListLOC)').length).toEqual(0)
      expect(wrapper.find('Connect(InputLookupQA)').length).toEqual(0)
      expect(wrapper.find('Connect(InputLiteral)').length).toEqual(0)
    })
  })

})
