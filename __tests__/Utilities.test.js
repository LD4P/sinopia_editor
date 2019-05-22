// Copyright 2019 Stanford University see Apache2.txt for license

import {isResourceWithValueTemplateRef, resourceToName } from '../src/Utilities'

describe('Utilities', () => {
  it('can check if a property template is a type of resource with valueTemplateRefs', () => {
    const trueTemplate = {
      "propertyURI": "http://id.loc.gov/ontologies/bibframe/note",
      "type": "resource",
      "valueConstraint": {
        "valueTemplateRefs": [
          "resourceTemplate:bf2:Note"
        ],
        "useValuesFrom": []
      }
    }
    expect(isResourceWithValueTemplateRef(trueTemplate)).toBeTruthy()

    const falseTemplate = {
      "propertyURI": "http://id.loc.gov/ontologies/bibframe/issuance",
      "type": "resource",
      "valueConstraint": {
        "useValuesFrom": [
          "https://id.loc.gov/vocabulary/issuance"
        ]
      }
    }
    expect(isResourceWithValueTemplateRef(falseTemplate)).toBeFalsy()

    const emptyTemplate = {}
    expect(isResourceWithValueTemplateRef(emptyTemplate)).toBeFalsy()

  })

  describe('resourceToName utility', () => {
    it('can get a resource name from the last path part of a URI', () => {
      const uri = "https://trellis.sinopia.io/resources/ld4p/resourceTemplate:bf2:Note"
      expect(resourceToName(uri)).toEqual("resourceTemplate:bf2:Note")
    })

    it('returns undefined if a URI is undefined', () => {
      expect(resourceToName()).toEqual(undefined)
    })
  })

})
