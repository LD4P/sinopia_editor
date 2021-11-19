// Copyright 2019 Stanford University see LICENSE for license
import {
  isResourceWithValueTemplateRef,
  resourceToName,
  datasetFromN3,
} from "utilities/Utilities"

describe("Utilities", () => {
  describe("isResourceWithValueTemplateRef()", () => {
    it("returns true when there is a valueTemplateRef", () => {
      const templateWithValueTemplateRefs = {
        propertyURI: "http://id.loc.gov/ontologies/bibframe/note",
        type: "resource",
        valueConstraint: {
          valueTemplateRefs: ["resourceTemplate:bf2:Note"],
        },
      }

      expect(
        isResourceWithValueTemplateRef(templateWithValueTemplateRefs)
      ).toBeTruthy()
    })

    it("returns true when there are multiple valueTemplateRefs", () => {
      const templateWithTwoValueTemplateRefs = {
        propertyURI: "http://id.loc.gov/ontologies/bibframe/note",
        type: "resource",
        valueConstraint: {
          valueTemplateRefs: [
            "resourceTemplate:bf2:Note",
            "resourceTemplate:bf2:Note2",
          ],
        },
      }

      expect(
        isResourceWithValueTemplateRef(templateWithTwoValueTemplateRefs)
      ).toBeTruthy()
    })

    it("returns false when valueTemplateRefs is empty", () => {
      const emptyValueTemplateRefs = {
        propertyURI: "http://id.loc.gov/ontologies/bibframe/issuance",
        type: "resource",
        valueConstraint: {
          valueTemplateRefs: [],
        },
      }

      expect(isResourceWithValueTemplateRef(emptyValueTemplateRefs)).toBeFalsy()
    })

    it("returns false when there is no valueConstraint", () => {
      const noValueConstraint = {
        propertyURI: "http://id.loc.gov/ontologies/bibframe/issuance",
        type: "resource",
      }

      expect(isResourceWithValueTemplateRef(noValueConstraint)).toBeFalsy()
    })

    it("returns false when valueConstraint is empty (there are no valueTemplateRefs)", () => {
      const emptyValueConstraint = {
        propertyURI: "http://id.loc.gov/ontologies/bibframe/issuance",
        type: "resource",
        valueConstraint: {},
      }

      expect(isResourceWithValueTemplateRef(emptyValueConstraint)).toBeFalsy()
    })

    it("returns false when the type is other than resource", () => {
      const notTypeResource = {
        propertyURI: "http://id.loc.gov/ontologies/bibframe/title",
        type: "literal",
        valueConstraint: {
          valueTemplateRefs: ["resourceTemplate:bf2:TitleNote"],
        },
      }

      expect(isResourceWithValueTemplateRef(notTypeResource)).toBeFalsy()
    })

    it("returns false when there is no type at all", () => {
      const noTypeAtAll = {
        propertyURI: "http://id.loc.gov/ontologies/bibframe/note",
        valueConstraint: {
          valueTemplateRefs: ["resourceTemplate:bf2:Note"],
        },
      }

      expect(isResourceWithValueTemplateRef(noTypeAtAll)).toBeFalsy()
    })
  })

  describe("resourceToName()", () => {
    it("returns resource name from last path part of URI", () => {
      const uri = "https://api.sinopia.io/resource/resourceTemplate:bf2:Note"

      expect(resourceToName(uri)).toEqual("resourceTemplate:bf2:Note")
    })

    it("returns the whole string when there is no last path part of the URI", () => {
      const urn = "urn:sinopia_io"

      expect(resourceToName(urn)).toEqual("urn:sinopia_io")
    })

    it("returns an empty string when the URI is an empty string", () => {
      expect(resourceToName("")).toEqual("")
    })

    it("returns undefined when there is no URI", () => {
      expect(resourceToName()).toEqual(undefined)
    })
  })

  describe("datasetFromN3()", () => {
    it("parses N3", async () => {
      const n3 = `<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@en .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:WorkTitle" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .
`
      const dataset = await datasetFromN3(n3)
      expect(dataset.toArray().length).toEqual(3)
    })
  })

  it("raises an error for invalid N3", async () => {
    await expect(datasetFromN3("foo")).rejects.toThrowError()
  })
})
