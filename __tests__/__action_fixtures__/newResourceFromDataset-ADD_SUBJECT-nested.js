import ResourceBuilder from "resourceBuilderUtils"
import suppressibleSubjectTemplate from "./subjectTemplate-suppressible"
import uriSubjectTemplate from "./subjectTemplate-uri"

const build = new ResourceBuilder({ injectPropertyIntoValue: true })

const expectedAction = {
  type: "ADD_SUBJECT",
  payload: build.subject({
    uri: "http://localhost:3000/resource/b6c5f4c0-e7cd-4ca5-a20f-2a37fe1080d6",
    subjectTemplate: suppressibleSubjectTemplate,
    properties: [
      build.property({
        values: [
          build.value({
            propertyUri: "http://sinopia.io/testing/Suppressible/property1",
            valueSubject: build.subject({
              subjectTemplate: uriSubjectTemplate,
              properties: [
                build.property({
                  values: [
                    build.uriValue({
                      propertyUri: "http://sinopia.io/testing/Uri/property1",
                      uri: "http://foo/bar",
                      label: "Foo Bar",
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
