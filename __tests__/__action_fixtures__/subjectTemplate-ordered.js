import ResourceBuilder from "resourceBuilderUtils"

const build = new ResourceBuilder()

const subjectTemplate = build.subjectTemplate({
  uri: "http://localhost:3000/resource/resourceTemplate:testing:ordered",
  id: "resourceTemplate:testing:ordered",
  clazz: "http://sinopia.io/testing/Ordered",
  classes: {
    "http://sinopia.io/testing/Ordered": "Ordered",
  },
  label: "Ordered",
  remark: "A template that contains an ordered nested resource.",
  propertyTemplates: [
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:ordered",
      label: "Ordered nested resource",
      uris: {
        "http://sinopia.io/testing/Ordered/property1": "Property1",
      },
      valueSubjectTemplateKeys: ["resourceTemplate:testing:literal"],
      type: "resource",
      component: "NestedResource",
      ordered: true,
      repeatable: true,
    }),
  ],
})

export default subjectTemplate
