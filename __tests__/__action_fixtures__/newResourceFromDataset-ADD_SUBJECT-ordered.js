import ResourceBuilder from "resourceBuilderUtils"
import orderedSubjectTemplate from "./subjectTemplate-ordered"
import literalSubjectTemplate from "./subjectTemplate-literal"

const build = new ResourceBuilder({ injectPropertyTemplateIntoValue: true })

const expectedAction = {
  type: "ADD_SUBJECT",
  payload: build.subject({
    uri: "http://localhost:3000/resource/b6c5f4c0-e7cd-4ca5-a20f-2a37fe1080d6",
    subjectTemplate: orderedSubjectTemplate,
    properties: [
      build.property({
        propertyUri: "http://sinopia.io/testing/Ordered/property1",
        values: [
          build.value({
            propertyUri: "http://sinopia.io/testing/Ordered/property1",
            valueSubject: build.subject({
              subjectTemplate: literalSubjectTemplate,
              properties: [
                build.property({
                  values: [
                    build.value({
                      propertyUri:
                        "http://sinopia.io/testing/Literal/property1",
                      literal: "literal1",
                      lang: "eng",
                      component: "InputLiteralValue",
                    }),
                  ],
                }),
              ],
            }),
          }),
          build.value({
            propertyUri: "http://sinopia.io/testing/Ordered/property1",
            valueSubject: build.orderedSubject({
              properties: [
                build.property({
                  values: [
                    build.value({
                      propertyUri:
                        "http://sinopia.io/testing/Literal/property1",
                      literal: "literal2",
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
