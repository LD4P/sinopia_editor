import { nanoid } from "nanoid"
import { defaultLanguageId } from "utilities/Utilities"

const newValue = (
  property,
  literal = null,
  lang = null,
  uri = null,
  label = null,
  valueSubject = null
) => ({
  key: nanoid(),
  property,
  literal,
  lang,
  uri,
  label,
  valueSubject,
})

export const newLiteralValue = (property, literal, lang = defaultLanguageId) =>
  newValue(property, literal, lang, null, null, null)

export const newUriValue = (property, uri, label, lang = defaultLanguageId) =>
  newValue(property, null, lang, uri, label, null)

// URI or literal
export const newBlankValue = (property) =>
  newValue(property, null, defaultLanguageId, null, null, null)

export const newValueSubject = (property, subject) =>
  newValue(property, null, null, null, null, subject)
