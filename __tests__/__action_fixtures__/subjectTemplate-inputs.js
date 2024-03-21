import ResourceBuilder from "resourceBuilderUtils"

const build = new ResourceBuilder()

const subjectTemplate = build.subjectTemplate({
  uri: "http://localhost:3000/resource/resourceTemplate:testing:inputs",
  id: "resourceTemplate:testing:inputs",
  clazz: "http://sinopia.io/testing/Inputs",
  classes: {
    "http://sinopia.io/testing/Inputs": "Inputs",
  },
  label: "Inputs",
  remark: "A template that contains multiple inputs.",
  propertyTemplates: [
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:inputs",
      label: "Literal input",
      uris: {
        "http://sinopia.io/testing/Inputs/property1": "Property1",
      },
      type: "literal",
      component: "InputLiteral",
    }),
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:inputs",
      label: "URI input",
      uris: {
        "http://sinopia.io/testing/Inputs/property2": "Property2",
      },
      type: "uri",
      component: "InputURI",
    }),
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:inputs",
      label: "Lookup input",
      uris: {
        "http://sinopia.io/testing/Inputs/property3": "Property3",
      },
      authorities: [build.authority("urn:ld4p:qa:oclc_fast:topic")],
      type: "uri",
      component: "InputLookup",
    }),
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:inputs",
      label: "List input",
      uris: {
        "http://sinopia.io/testing/Inputs/property4": "Property4",
      },
      authorities: [build.authority("https://id.loc.gov/vocabulary/carriers")],
      type: "uri",
      component: "InputList",
    }),
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:inputs",
      label: "Nested resource",
      uris: {
        "http://sinopia.io/testing/Inputs/property5": "Property5",
      },
      valueSubjectTemplateKeys: ["resourceTemplate:testing:literal"],
      type: "resource",
      component: "NestedResource",
    }),
  ],
})

export default subjectTemplate
