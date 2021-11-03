import ResourceBuilder from "resourceBuilderUtils"
import subjectTemplate from "./subjectTemplate-inputs"

const build = new ResourceBuilder({ injectPropertyIntoValue: true })

const expectedAction = {
  type: "ADD_SUBJECT",
  payload: build.resource({
    uri: "http://localhost:3000/resource/b6c5f4c0-e7cd-4ca5-a20f-2a37fe1080d6",
    subjectTemplate,
    properties: [
      build.property({
        values: [
          build.value({
            propertyUri: "http://sinopia.io/testing/Inputs/property1",
            literal: "A literal value",
            lang: "eng",
            component: "InputLiteralValue",
          }),
        ],
      }),
      build.property({
        values: [
          build.value({
            propertyUri: "http://sinopia.io/testing/Inputs/property2",
            lang: "eng",
            uri: "http://uri/value",
            label: "A URI value",
            component: "InputURIValue",
          }),
        ],
      }),
      build.property({
        values: [
          build.value({
            propertyUri: "http://sinopia.io/testing/Inputs/property3",
            lang: "eng",
            uri: "http://aims.fao.org/aos/agrovoc/c_331388",
            label: "corn sheller",
            component: "InputURIValue",
          }),
        ],
      }),
      build.property({
        values: [
          build.value({
            propertyUri: "http://sinopia.io/testing/Inputs/property4",
            uri: "http://id.loc.gov/vocabulary/carriers/sq",
            label: "audio roll",
            component: "InputURIValue",
          }),
        ],
      }),
      build.property({
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
                  values: [
                    build.value({
                      propertyUri:
                        "http://sinopia.io/testing/Literal/property1",
                      literal: "A nested resource",
                      lang: "eng",
                      component: "InputLiteralValue",
                    }),
                  ],
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
