import { nanoid } from "nanoid"
import Config from "Config"

const newValue = (
  property,
  literal = null,
  lang = null,
  uri = null,
  label = null,
  valueSubject = null,
  component = null
) => ({
  key: nanoid(),
  property,
  literal,
  lang,
  uri,
  label,
  valueSubject,
  component,
})

export const newLiteralValue = (
  property,
  literal,
  lang = Config.defaultLanguageId
) => newValue(property, literal, lang, null, null, null, "InputLiteralValue")

export const newBlankLiteralValue = (property) =>
  newValue(
    property,
    null,
    Config.defaultLanguageId,
    null,
    null,
    null,
    "InputLiteralValue"
  )

export const newUriValue = (
  property,
  uri,
  label,
  lang = Config.defaultLanguageId
) => newValue(property, null, lang, uri, label, null, "InputURIValue")

export const newBlankUriValue = (property) =>
  newValue(
    property,
    null,
    Config.defaultLanguageId,
    null,
    null,
    null,
    "InputURIValue"
  )

export const newBlankLookupValue = (property) =>
  newValue(property, null, null, null, null, null, "InputLookupValue")

export const newBlankListValue = (property) =>
  newValue(property, null, null, null, null, null, "InputListValue")

export const newValueSubject = (property, subject) =>
  newValue(property, null, null, null, null, subject)
