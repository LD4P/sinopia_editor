import ResourceBuilder from "resourceBuilderUtils"

const build = new ResourceBuilder()

const expectedAction = {
  type: "ADD_VALUE",
  payload: {
    value: build.subjectValue({
      propertyKey: "v1o90QO1Qx",
      propertyUri:
        "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      valueSubject: build.subject({
        subjectTemplate: build.subjectTemplate({
          uri: "http://localhost:3000/resource/resourceTemplate:testing:uber2",
          id: "resourceTemplate:testing:uber2",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
          label: "Uber template2",
          remark:
            "Template for testing purposes with single repeatable literal.",
          propertyTemplates: [
            build.propertyTemplate({
              subjectTemplateKey: "resourceTemplate:testing:uber2",
              label: "Uber template2, property1",
              uris: {
                "http://id.loc.gov/ontologies/bibframe/uber/template2/property1":
                  "http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
              },
              repeatable: true,
              remark: "A repeatable literal",
              type: "literal",
              component: "InputLiteral",
            }),
          ],
        }),
        properties: [build.property()],
      }),
    }),
  },
}

export default expectedAction
