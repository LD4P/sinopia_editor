// Copyright 2019 Stanford University see LICENSE for license

import { addTemplates } from "reducers/templates"
import { createState } from "stateUtils"

describe("addTemplates", () => {
  const subjectTemplate = {
    key: "ld4p:RT:bf2:Title:AbbrTitle",
    id: "ld4p:RT:bf2:Title:AbbrTitle",
    class: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
    label: "Abbreviated Title",
    propertyTemplateKeys: [
      "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
    ],
    propertyTemplates: [
      {
        key: "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
        subjectTemplateKey: "ld4p:RT:bf2:Title:AbbrTitle",
        label: "Abbreviated Title",
        uri: "http://id.loc.gov/ontologies/bibframe/mainTitle",
        required: false,
        repeatable: false,
        defaults: [],
        remark: undefined,
        remarkUrl: null,
        type: null,
        component: null,
        valueSubjectTemplateKeys: null,
        authorities: [],
      },
    ],
  }
  it("adds subject template and property templates", () => {
    const state = createState()

    const newState = addTemplates(state.entities, { payload: subjectTemplate })

    const newSubjectTemplate =
      newState.subjectTemplates["ld4p:RT:bf2:Title:AbbrTitle"]
    expect(newSubjectTemplate).toBeSubjectTemplate(
      "ld4p:RT:bf2:Title:AbbrTitle"
    )
    expect(newSubjectTemplate.propertyTemplates).toBeUndefined()

    expect(
      newState.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ]
    ).toBePropertyTemplate(
      "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
    )
  })
})
