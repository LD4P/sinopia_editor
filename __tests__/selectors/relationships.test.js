import { createState } from "stateUtils"
import { selectRelationships, hasRelationships } from "selectors/relationships"

describe("selectRelationships()", () => {
  it("merges relationships from resource and API (inferred)", () => {
    const state = createState({ hasTemplateWithLiteral: true })
    const subject = state.entities.subjects["8VrbxGPeF"]
    subject.bfAdminMetadataRefs = [
      "http://localhost:3000/resource/922b24cb-0b5f-4df6-88d2-cb9efdf3f373",
    ]
    subject.bfItemRefs = [
      "http://localhost:3000/resource/032b24cb-0b5f-4df6-88d2-cb9efdf3f374",
    ]
    subject.bfInstanceRefs = []
    subject.bfWorkRefs = []
    state.entities.relationships["8VrbxGPeF"] = {
      bfAdminMetadataRefs: [
        "http://localhost:3000/resource/142b24cb-0b5f-4df6-88d2-cb9efdf3f375",
      ],
      bfItemRefs: [
        "http://localhost:3000/resource/032b24cb-0b5f-4df6-88d2-cb9efdf3f374",
      ],
      bfInstanceRefs: [
        "http://localhost:3000/resource/252b24cb-0b5f-4df6-88d2-cb9efdf3f376",
      ],
      bfWorkRefs: [],
    }

    expect(selectRelationships(state, "8VrbxGPeF")).toStrictEqual({
      bfAdminMetadataRefs: [
        "http://localhost:3000/resource/922b24cb-0b5f-4df6-88d2-cb9efdf3f373",
        "http://localhost:3000/resource/142b24cb-0b5f-4df6-88d2-cb9efdf3f375",
      ],
      bfItemRefs: [
        "http://localhost:3000/resource/032b24cb-0b5f-4df6-88d2-cb9efdf3f374",
      ],
      bfInstanceRefs: [
        "http://localhost:3000/resource/252b24cb-0b5f-4df6-88d2-cb9efdf3f376",
      ],
      bfWorkRefs: [],
    })
  })
})

describe("hasRelationships()", () => {
  it("returns true when relationships", () => {
    const state = createState({ hasTemplateWithLiteral: true })
    state.entities.subjects["8VrbxGPeF"].bfAdminMetadataRefs = [
      "http://localhost:3000/resource/922b24cb-0b5f-4df6-88d2-cb9efdf3f373",
    ]

    expect(hasRelationships(state, "8VrbxGPeF")).toBe(true)
  })

  it("returns false when no relationships", () => {
    const state = createState({ hasTemplateWithLiteral: true })

    expect(hasRelationships(state, "8VrbxGPeF")).toBe(false)
  })
})
