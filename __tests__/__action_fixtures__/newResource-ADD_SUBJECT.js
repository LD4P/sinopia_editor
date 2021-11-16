import ResourceBuilder from "resourceBuilderUtils"
import subjectTemplate from "./subjectTemplate-inputs"
import literalSubjectTemplate from "./subjectTemplate-literal"

const build = new ResourceBuilder({ injectPropertyKeyIntoValue: true })

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
              subjectTemplate: literalSubjectTemplate,
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
