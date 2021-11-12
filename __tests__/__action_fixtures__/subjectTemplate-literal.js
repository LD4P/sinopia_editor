import ResourceBuilder from "resourceBuilderUtils"

const build = new ResourceBuilder()

const subjectTemplate = build.subjectTemplate({
  uri: "http://localhost:3000/resource/resourceTemplate:testing:literal",
  id: "resourceTemplate:testing:literal",
  clazz: "http://sinopia.io/testing/Literal",
  label: "Literal",
  remark: "A template that contains a single literal input.",
  propertyTemplates: [
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:literal",
      label: "Literal input",
      uris: {
        "http://sinopia.io/testing/Literal/property1": "Property1",
      },
      type: "literal",
      component: "InputLiteral",
    }),
  ],
})

export default subjectTemplate
