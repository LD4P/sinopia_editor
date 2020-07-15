import shortid from 'shortid'

const newValue = (propertyKey, resourceKey, literal, lang, uri, label, valueSubjectKey) => {
  const key = shortid.generate()
  return {
    key,
    propertyKey,
    resourceKey,
    literal,
    lang,
    uri,
    label,
    valueSubjectKey,
  }
}

export const newLiteralValue = (propertyKey, resourceKey, literal, lang) => newValue(propertyKey, resourceKey, literal, lang, null, null, null)

export const newUriValue = (propertyKey, resourceKey, uri, label) => newValue(propertyKey, resourceKey, null, null, uri, label, null)

export const newValueSubject = (propertyKey, resourceKey, subjectKey) => newValue(propertyKey, resourceKey, null, null, null, null, subjectKey)
