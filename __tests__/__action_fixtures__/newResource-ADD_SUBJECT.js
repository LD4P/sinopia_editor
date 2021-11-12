import ResourceBuilder from "resourceBuilderUtils"
import subjectTemplate from "./subjectTemplate-inputs"

const build = new ResourceBuilder({ injectPropertyIntoValue: true })

const expectedAction = {
  type: "ADD_SUBJECT",
  payload: build.subject({
    subjectTemplate,
    properties: [
      build.property({
        values: [],
        show: true,
      }),
      build.property({
        values: [],
        show: true,
      }),
      build.property({
        values: [],
        show: true,
      }),
      build.property({
        values: [],
        show: true,
      }),
      build.property({
        show: true,
        values: [
          build.value({
            propertyUri: "http://sinopia.io/testing/Inputs/property5",
            valueSubject: build.subject({
              subjectTemplate: build.subjectTemplate({
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
                      "http://sinopia.io/testing/Literal/property1":
                        "Property1",
                    },
                    type: "literal",
                    component: "InputLiteral",
                  }),
                ],
              }),
              properties: [
                build.property({
                  values: null,
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  }),
}

export default expectedAction
