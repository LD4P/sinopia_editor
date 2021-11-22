import { parseLangTag, stringifyLangTag } from "utilities/Language"

describe("Language", () => {
  describe("parseLangTag()", () => {
    it("parses lang only", () => {
      expect(parseLangTag("ja")).toEqual(["ja", null, null])
    })
    it("parses lang and script", () => {
      expect(parseLangTag("ja-Latn")).toEqual(["ja", "Latn", null])
    })
    it("parses lang, script, and transliteration", () => {
      expect(parseLangTag("ja-Latn-t-ja-m0-alaloc")).toEqual([
        "ja",
        "Latn",
        "alaloc",
      ])
    })
    it("parses lang and transliteration", () => {
      expect(parseLangTag("ja-t-ja-m0-alaloc")).toEqual(["ja", null, "alaloc"])
    })
  })

  describe("stringifyLangTag()", () => {
    it("stringifies lang only", () => {
      expect(stringifyLangTag("ja", null, null)).toEqual("ja")
    })
    it("stringifies lang and script", () => {
      expect(stringifyLangTag("ja", "Latn", null)).toEqual("ja-Latn")
    })
    it("stringifies lang, script, and transliteration", () => {
      expect(stringifyLangTag("ja", "Latn", "alaloc")).toEqual(
        "ja-Latn-t-ja-m0-alaloc"
      )
    })
    it("stringifies lang and transliteration", () => {
      expect(stringifyLangTag("ja", null, "alaloc")).toEqual(
        "ja-t-ja-m0-alaloc"
      )
    })
  })
})
