import ResourceBuilder from "resourceBuilderUtils"

const build = new ResourceBuilder({ injectPropertyTemplateIntoValue: true })

const expectedAction = {
  type: "ADD_SUBJECT",
  payload: build.subject({
    subjectTemplate: build.subjectTemplate({
      id: "ld4p:RT:bf2:Title:AbbrTitle",
      clazz: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
      label: "Abbreviated Title",
      author: "LD4P",
      date: "2019-08-19",
      propertyTemplateKeys: [
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
      ],
    }),
    properties: [
      build.property({
        propertyTemplate: build.propertyTemplate({
          subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
          label: "Abbreviated Title",
          uris: {
            "http://id.loc.gov/ontologies/bibframe/mainTitle": "Main title",
          },
          type: "literal",
          component: "InputLiteral",
        }),
        show: true,
        values: [
          build.value({
            literal: "foo",
            lang: "eng",
            component: "InputLiteralValue",
            propertyUri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
          }),
        ],
      }),
    ],
  }),
}

export default expectedAction
