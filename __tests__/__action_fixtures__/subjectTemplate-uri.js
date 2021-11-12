import ResourceBuilder from "resourceBuilderUtils"

const build = new ResourceBuilder()

const subjectTemplate = build.subjectTemplate({
  uri: "http://localhost:3000/resource/resourceTemplate:testing:uri",
  id: "resourceTemplate:testing:uri",
  clazz: "http://sinopia.io/testing/Uri",
  label: "URI",
  remark: "A template that contains a single URI input.",
  suppressible: true,
  propertyTemplates: [
    build.propertyTemplate({
      subjectTemplateKey: "resourceTemplate:testing:uri",
      label: "URI input",
      uris: {
        "http://sinopia.io/testing/Uri/property1": "Property1",
      },
      type: "uri",
      component: "InputURI",
    }),
  ],
})

export default subjectTemplate
