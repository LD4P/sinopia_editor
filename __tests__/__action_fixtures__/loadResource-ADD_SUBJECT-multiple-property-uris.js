import ResourceBuilder from "resourceBuilderUtils"
import subjectTemplate from "./subjectTemplate-multiple_property_uris"
import literalSubjectTemplate from "./subjectTemplate-literal"

const build = new ResourceBuilder({ injectPropertyKeyIntoValue: true })

const expectedAction = {
  type: "ADD_SUBJECT",
  payload: build.resource({
    uri: "http://localhost:3000/resource/c7c5f4c0-e7cd-4ca5-a20f-2a37fe1080d7",
    subjectTemplate,
    classes: ["http://sinopia.io/testing/MultiplePropertyUris"],
    properties: [
      build.property({
        values: [
          build.value({
            propertyUri:
              "http://sinopia.io/testing/MultiplePropertyUris/property1b",
            literal: "A literal value",
            lang: "eng",
            component: "InputLiteralValue",
          }),
        ],
      }),
      build.property({
        values: [
          build.value({
            propertyUri:
              "http://sinopia.io/testing/MultiplePropertyUris/property2b",
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
            propertyUri:
              "http://sinopia.io/testing/MultiplePropertyUris/property3b",
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
            propertyUri:
              "http://sinopia.io/testing/MultiplePropertyUris/property4b",
            uri: "http://id.loc.gov/vocabulary/carriers/sq",
            label: "audio roll",
            component: "InputURIValue",
          }),
        ],
      }),
      build.property({
        values: [
          build.value({
            propertyUri:
              "http://sinopia.io/testing/MultiplePropertyUris/property5b",
            valueSubject: build.subject({
              subjectTemplate: literalSubjectTemplate,
              classes: ["http://sinopia.io/testing/Literal"],
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
