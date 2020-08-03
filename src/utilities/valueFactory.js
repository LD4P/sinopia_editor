import shortid from 'shortid'

const newValue = (property, literal, lang, uri, label, valueSubject) => {
  const key = shortid.generate()
  const resourceKey = property.resourceKey
  return {
    key,
    property,
    resourceKey,
    literal,
    lang,
    uri,
    label,
    valueSubject,
  }
}

export const newLiteralValue = (property, literal, lang) => newValue(property, literal, lang, null, null, null)

export const newUriValue = (property, uri, label) => newValue(property, null, null, uri, label, null)

export const newValueSubject = (property, subject) => newValue(property, null, null, null, null, subject)
