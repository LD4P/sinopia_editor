import ResourceBuilder from "resourceBuilderUtils"

const build = new ResourceBuilder()

const subjectTemplate = build.subjectTemplate({
  uri: "http://localhost:3000/resource/resourceTemplate:testing:multiplePropertyUris",
  id: "resourceTemplate:testing:multiplePropertyUris",
  clazz: "http://sinopia.io/testing/MultiplePropertyUris",
  classes: {
    "http://sinopia.io/testing/MultiplePropertyUris": "Multiple Property URIs",
  },
  label: "Inputs with multiple property URIs",
  remark:
    "A template that contains multiple inputs with multiple property URIs.",
  propertyTemplates: [
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:multiplePropertyUris",
      label: "Literal input",
      uris: {
        "http://sinopia.io/testing/MultiplePropertyUris/property1": "Property1",
        "http://sinopia.io/testing/MultiplePropertyUris/property1b":
          "Property1b",
      },
      type: "literal",
      component: "InputLiteral",
    }),
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:multiplePropertyUris",
      label: "URI input",
      uris: {
        "http://sinopia.io/testing/MultiplePropertyUris/property2": "Property2",
        "http://sinopia.io/testing/MultiplePropertyUris/property2b":
          "Property2b",
      },
      type: "uri",
      component: "InputURI",
    }),
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:multiplePropertyUris",
      label: "Lookup input",
      uris: {
        "http://sinopia.io/testing/MultiplePropertyUris/property3": "Property3",
        "http://sinopia.io/testing/MultiplePropertyUris/property3b":
          "Property3b",
      },
      authorities: [build.authority("urn:ld4p:qa:oclc_fast:topic")],
      type: "uri",
      component: "InputLookup",
    }),
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:multiplePropertyUris",
      label: "List input",
      uris: {
        "http://sinopia.io/testing/MultiplePropertyUris/property4": "Property4",
        "http://sinopia.io/testing/MultiplePropertyUris/property4b":
          "Property4b",
      },
      authorities: [build.authority("https://id.loc.gov/vocabulary/carriers")],
      type: "uri",
      component: "InputList",
    }),
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:multiplePropertyUris",
      label: "Nested resource",
      uris: {
        "http://sinopia.io/testing/MultiplePropertyUris/property5": "Property5",
        "http://sinopia.io/testing/MultiplePropertyUris/property5b":
          "Property5b",
      },
      valueSubjectTemplateKeys: ["resourceTemplate:testing:literal"],
      type: "resource",
      component: "NestedResource",
    }),
  ],
})

export default subjectTemplate
