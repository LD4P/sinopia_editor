import { createState } from "stateUtils"
import { selectLanguageLabel } from "selectors/languages"

describe("selectLanguageLabel()", () => {
  it("returns an ampty string if there are no language options", () => {
    const state = createState()
    expect(selectLanguageLabel(state, null)).toEqual("")
  })

  it("returns the language label for a given language id", () => {
    const state = createState()
    expect(selectLanguageLabel(state, "tai")).toEqual("Tai languages")
    expect(selectLanguageLabel(state, "eng")).toEqual("English")
  })
})
