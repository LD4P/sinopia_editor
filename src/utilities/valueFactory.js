import { nanoid } from "nanoid"
import { defaultLanguageId } from "utilities/Utilities"

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

export const newLiteralValue = (
  property,
  propertyUri,
  literal,
  lang = defaultLanguageId
) =>
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

export const newBlankLiteralValue = (property, propertyUri) =>
  newValue(
    property,
    propertyUri,
    null,
    defaultLanguageId,
    null,
    null,
    null,
    "InputLiteralValue"
  )

export const newUriValue = (
  property,
  propertyUri,
  uri,
  label,
  lang = defaultLanguageId
) =>
  newValue(property, propertyUri, null, lang, uri, label, null, "InputURIValue")

export const newBlankUriValue = (property, propertyUri) =>
  newValue(
    property,
    propertyUri,
    null,
    defaultLanguageId,
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
