export const parseLangTag = (tag) => {
  if (!tag) return [null, null, null]

  // This parsing could be more rigorous, but starting with simplest approach.
  const splitLang = tag.split("-")
  const langSubtag = splitLang[0]
  const scriptSubtag = parseScriptTag(splitLang)
  const transliterationSubtag = parseTransliterationSubtag(splitLang)

  return [langSubtag, scriptSubtag, transliterationSubtag]
}

export const stringifyLangTag = (langCode, scriptCode, transliterationCode) => {
  if (!langCode) return null
  const subtags = [langCode]
  if (scriptCode) subtags.push(scriptCode)
  if (transliterationCode)
    subtags.push(`t-${langCode}-m0-${transliterationCode}`)

  return subtags.join("-")
}

const startsWithUpperCase = (str) =>
  str.charAt(0) === str.charAt(0).toUpperCase()

const parseScriptTag = (splitLang) => {
  if (!splitLang[1]) return null
  if (!startsWithUpperCase(splitLang[1])) return null

  return splitLang[1]
}

const parseTransliterationSubtag = (splitLang) => {
  // For example, ja-Latn-t-ja-m0-alaloc
  const matchPos = [1, 2].find(
    (pos) =>
      splitLang[pos] === "t" &&
      splitLang[pos + 2] === "m0" &&
      !startsWithUpperCase(splitLang[pos + 3])
  )
  return matchPos ? splitLang[matchPos + 3] : null
}
