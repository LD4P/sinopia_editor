import ResourceBuilder from "resourceBuilderUtils"

const build = new ResourceBuilder()

const subjectTemplate = build.subjectTemplate({
  uri: "http://localhost:3000/resource/resourceTemplate:testing:suppressible",
  id: "resourceTemplate:testing:suppressible",
  clazz: "http://sinopia.io/testing/Suppressible",
  label: "Suppressible nested resource",
  remark: "A template that contains a suppressible nested resource.",
  propertyTemplates: [
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:suppressible",
      label: "Suppressible nested resource",
      uris: {
        "http://sinopia.io/testing/Suppressible/property1": "Property1",
      },
      valueSubjectTemplateKeys: ["resourceTemplate:testing:uri"],
      type: "resource",
      component: "NestedResource",
    }),
  ],
})

export default subjectTemplate
