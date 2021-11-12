import ResourceBuilder from "resourceBuilderUtils"

const build = new ResourceBuilder()

const expectedAction = {
  type: "ADD_VALUE",
  payload: {
    value: build.subjectValue({
      // "key": "abc2",
      propertyKey: "v1o90QO1Qx",
      propertyUri:
        "http://id.loc.gov/ontologies/bibframe/uber/template1/property1",
      valueSubject: build.subject({
        subjectTemplate: build.subjectTemplate({
          id: "resourceTemplate:testing:uber2",
          clazz: "http://id.loc.gov/ontologies/bibframe/Uber2",
          label: "Uber template2",
          remark:
            "Template for testing purposes with single repeatable literal with a link to Stanford at https://www.stanford.edu",
          propertyTemplates: [
            build.propertyTemplate({
              key: "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1",
              subjectTemplateKey: "resourceTemplate:testing:uber2",
              label: "Uber template2, property1",
              uris: {
                "http://id.loc.gov/ontologies/bibframe/uber/template2/property1":
                  "Property1",
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
    siblingValueKey: "VDOeQCnFA8",
  },
}

export default expectedAction
