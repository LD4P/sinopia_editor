import { nanoid } from "nanoid"
import { chooseLang } from "./Language"

const newValue = (
  property,
  propertyUri,
  literal = null,
  lang = null,
  uri = null,
  label = null,
  valueSubject = null,
  component = null
) => ({
  key: nanoid(),
  propertyKey: property.key,
  propertyUri,
  literal,
  lang,
  uri,
  label,
  valueSubject,
  component,
})

export const newLiteralValue = (property, propertyUri, literal, lang) =>
  newValue(
    property,
    propertyUri,
    literal,
    lang,
    null,
    null,
    null,
    "InputLiteralValue"
  )

export const newBlankLiteralValue = (
  property,
  languageSuppressed,
  defaultLang,
  propertyUri
) =>
  newValue(
    property,
    propertyUri,
    null,
    chooseLang(languageSuppressed, defaultLang),
    null,
    null,
    null,
    "InputLiteralValue"
  )

export const newUriValue = (property, propertyUri, uri, label, lang) =>
  newValue(property, propertyUri, null, lang, uri, label, null, "InputURIValue")

export const newBlankUriValue = (
  property,
  languageSuppressed,
  defaultLang,
  propertyUri
) =>
  newValue(
    property,
    propertyUri,
    null,
    chooseLang(languageSuppressed, defaultLang),
    null,
    null,
    null,
    "InputURIValue"
  )

export const newBlankLookupValue = (property, propertyUri) =>
  newValue(
    property,
    propertyUri,
    null,
    null,
    null,
    null,
    null,
    "InputLookupValue"
  )

export const newBlankListValue = (property, propertyUri) =>
  newValue(
    property,
    propertyUri,
    null,
    null,
    null,
    null,
    null,
    "InputListValue"
  )

export const newValueSubject = (property, propertyUri, subject) =>
  newValue(property, propertyUri, null, null, null, null, subject)
