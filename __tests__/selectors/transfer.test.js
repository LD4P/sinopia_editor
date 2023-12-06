import { createState } from "stateUtils"
import { selectLocalId } from "selectors/transfer"

describe("selectLocalId()", () => {
  it("is nil when no local id", () => {
    const state = createState()
    expect(selectLocalId(state, "abc123", "FOLIO", "stanford")).toBe(undefined)
  })

  it("returns local id", () => {
    const state = createState()
    state.entities.localIds = {
      abc123: {
        FOLIO: {
          stanford: "123456",
        },
      },
    }
    expect(selectLocalId(state, "abc123", "FOLIO", "stanford")).toBe("123456")
  })
})
