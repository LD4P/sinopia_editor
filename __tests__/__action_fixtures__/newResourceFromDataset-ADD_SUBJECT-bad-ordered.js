import ResourceBuilder from "resourceBuilderUtils"
import orderedSubjectTemplate from "./subjectTemplate-ordered"

const build = new ResourceBuilder({ injectPropertyKeyIntoValue: true })

const expectedAction = {
  type: "ADD_SUBJECT",
  payload: build.subject({
    uri: "http://localhost:3000/resource/b6c5f4c0-e7cd-4ca5-a20f-2a37fe1080d6",
    subjectTemplate: orderedSubjectTemplate,
    properties: [
      build.property({
        propertyUri: "http://sinopia.io/testing/Ordered/property1",
      }),
    ],
  }),
}

export default expectedAction
