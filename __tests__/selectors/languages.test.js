import { createState } from "stateUtils"
import { selectLanguageLabel } from "selectors/languages"

describe("selectLanguageLabel()", () => {
  it("returns No Language Specified when no tag", () => {
    const state = createState()
    expect(selectLanguageLabel(state, null)).toEqual("No language specified")
  })

  it("returns English for en", () => {
    const state = createState()
    expect(selectLanguageLabel(state, "en")).toEqual("English")
  })

  it("returns language label for language", () => {
    const state = createState()
    expect(selectLanguageLabel(state, "taw")).toEqual("Tai")
  })

  it("returns Unknown language for unknown language", () => {
    const state = createState()
    expect(selectLanguageLabel(state, "foo")).toEqual("Unknown language (foo)")
  })

  it("returns script label for script", () => {
    const state = createState()
    expect(selectLanguageLabel(state, "en-Latn")).toEqual("English - Latin")
  })

  it("returns Unknown script for unknown script", () => {
    const state = createState()
    expect(selectLanguageLabel(state, "en-Foo")).toEqual(
      "English - Unknown script (Foo)"
    )
  })

  it("returns transliteration label for transliteration", () => {
    const state = createState()
    expect(selectLanguageLabel(state, "en-t-en-m0-alalc")).toEqual(
      "English - American Library Association-Library of Congress"
    )
  })

  it("returns Unknown script for unknown transliteration", () => {
    const state = createState()
    expect(selectLanguageLabel(state, "en-t-en-m0-foo")).toEqual(
      "English - Unknown transliteration (foo)"
    )
  })
})
