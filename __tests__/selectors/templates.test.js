import { createState } from "stateUtils"
import { selectSubjectAndPropertyTemplates } from "selectors/templates"

describe("selectSubjectAndPropertyTemplates()", () => {
  it("returns null when no subject", () => {
    const state = createState()
    expect(selectSubjectAndPropertyTemplates(state, "abc123")).toEqual(null)
  })

  it("returns templates", () => {
    const state = createState({ hasResourceWithLiteral: true })
    const subjectTemplate = selectSubjectAndPropertyTemplates(
      state,
      "ld4p:RT:bf2:Title:AbbrTitle"
    )
    expect(subjectTemplate).toBeSubjectTemplate("ld4p:RT:bf2:Title:AbbrTitle")
    expect(subjectTemplate.propertyTemplates).toBePropertyTemplates([
      "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle",
    ])
  })
})
