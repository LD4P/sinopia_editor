// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'
import { mount } from 'enzyme';
import ValueConstraints from '../../../src/components/editor/ValueConstraints'

const jsdom = require("jsdom");

setUpDomEnvironment();

const vcProps = {
  "propertyTemplates": [
    {
      "valueConstraint": {
        "defaults": [
          {
            "defaultLiteral": "DEFAULT",
            "defaultURI": "http://default"
          }
        ],
        "editable": "true",
        "languageLabel": "LANGUAGE LABEL",
        "languageURI": "http://id.loc.gov/vocabulary/languages/eng",
        "remark": "REMARK",
        "repeatable": "false",
        "useValuesFrom": [
          "http://VALUES"
        ],
        "validatePattern": "PATTERN",
        "valueDataType": {
          "dataTypeLabel": "Classification item number",
          "dataTypeLabelHint": "HINT",
          "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/itemPortion",
          "remark": "REMARK"
        },
        "valueLanguage": "VALUE LANGUAGE",
        "valueTemplateRefs": [
          "profile:bf2:Identifiers:Barcode"
        ]
      }
    }
  ]
}

const props = {}
const vcProp = vcProps.propertyTemplates[0].valueConstraint
props.defaults = vcProp.defaults
props.editable = vcProp.editable
props.languageLabel = vcProp.languageLabel
props.languageURI = vcProp.languageURI
props.remark = vcProp.remark
props.repeatable = vcProp.repeatable
props.useValuesFrom = vcProp.useValuesFrom
props.validatePattern = vcProp.validatePattern
props.valueDataType = vcProp.valueDataType
props.valueLanguage = vcProp.valueLanguage
props.valueTemplateRefs = vcProp.valueTemplateRefs

let wrapper = mount(<ValueConstraints {...props} />)

describe('<ValueConstraints />', () => {
  it('has div with class "ValueConstraints"', () => {
    expect(wrapper.find('h6').text()).toEqual('VALUE CONSTRAINTS')
    expect(wrapper.find('div.ValueConstraints > ul > li')).toHaveLength(11)
    wrapper.find('div.ValueConstraints > ul > li').filterWhere(n => n.children().length === 0).forEach((node) => {
      expect(node.containsAnyMatchingElements([
        'editable: true',
        'languageLabel: LANGUAGE LABEL',
        'languageURI: http://id.loc.gov/vocabulary/languages/eng',
        'remark: REMARK',
        'repeatable: false',
        'validatePattern: PATTERN',
        'valueLanguage: VALUE LANGUAGE'
      ]))
    })
  })
})

describe('when values are present', () => {

  describe('<Defaults />', () => {
    it('has defaults', () => {
      expect(wrapper.find('Defaults > div > ul > li').length).toBe(2)
      wrapper.find('Defaults > div > ul > li').forEach((node) => {
        expect(node.containsAnyMatchingElements([
          'defaultURI: http://default',
          'defaultLiteral: DEFAULT'
        ]))
      })
    })
  })

  describe('<ValueTemplateRefs />', () => {
    it('has valueTemplateRefs', () => {
      expect(wrapper.find('ValueTemplateRefs > div > ul > li').text()).toEqual('profile:bf2:Identifiers:Barcode')
    })
  })

  describe('<UseValuesFrom />', () => {
    it('has useValuesFrom', () => {
      expect(wrapper.find('UseValuesFrom > div > ul > li').text()).toEqual('http://VALUES')
    })
  })

  describe('<ValueDataTypes />', () => {
    it('has valueDataTypes', () => {
      expect(wrapper.find('ValueDataTypes > div > ul > li').length).toBe(4)
      wrapper.find('ValueDataTypes > div > ul > li').forEach((node) => {
        expect(node.containsAnyMatchingElements([
          'dataTypeLabel: Classification item number',
          'dataTypeLabelHint: HINT',
          'dataTypeURI: http://id.loc.gov/ontologies/bibframe/itemPortion',
          'remark: REMARK'
        ]))
      })
    })
  })

})

describe('reset', () => {
})

describe('when values are not present', () => {
  delete props.editable
  delete props.languageLabel
  delete props.languageURI
  delete props.remark
  delete props.repeatable
  delete props.validatePattern
  delete props.valueLanguage

  props.defaults = ''
  props.useValuesFrom = ''
  props.valueDataType = ''
  props.valueTemplateRefs = ''

  let valueConstraints = (
    <ValueConstraints {...props} />
  )

  let wrapper = mount(valueConstraints)

  describe('<ValueConstraints />', () => {
    it('does not render the li for base ValueConstraints values if there are no props', () => {
      expect(wrapper.find('ValueConstraints > div > ul > li').length).toBe(0)
    })
  })

  describe('<Defaults />', () => {
    it('does not render the li for Defaults if there are no values', () => {
      expect(wrapper.find('Defaults > div > ul > li').length).toBe(0)
    })
  })

  describe('<ValueTemplateRefs />', () => {
    it('does not render the li for valueTemplateRefs if there is no value', () => {
      expect(wrapper.find('ValueTemplateRefs > div > ul > li').length).toBe(0)
    })
  })

  describe('<UseValuesFrom />', () => {
    it('does not render the li for useValuesFrom if there is no value', () => {
      expect(wrapper.find('UseValuesFrom > div > ul > li').length).toBe(0)
    })
  })

  describe('<ValueDataTypes />', () => {
    it('does not render the li for valueDataTypes if there is no value', () => {
      expect(wrapper.find('ValueDataTypes > div > ul > li').length).toBe(0)
    })
  })

})

describe('cleanup', () => {

  it('unmounts the wrapper', () => {
    expect(wrapper.debug().length).toBeGreaterThanOrEqual(1)
    wrapper.unmount();
    expect(wrapper.debug().length).toBe(0)
  })
})

function setUpDomEnvironment() {
  const { JSDOM } = jsdom;
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {url: 'http://localhost/'});
  const { window } = dom;

  global.window = window;
  global.document = window.document;
  global.navigator = {
    userAgent: 'node.js',
  };
  copyProps(window, global);
}
function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}
