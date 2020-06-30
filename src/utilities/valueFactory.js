import shortid from 'shortid'

const newValue = (propertyKey, literal, lang, uri, label, valueSubjectKey) => {
  const key = shortid.generate()
  return {
    key,
    propertyKey,
    literal,
    lang,
    uri,
    label,
    valueSubjectKey,
  }
}

export const newLiteralValue = (propertyKey, literal, lang) => newValue(propertyKey, literal, lang, null, null, null)

export const newUriValue = (propertyKey, uri, label) => newValue(propertyKey, null, null, uri, label, null)

export const newValueSubject = (propertyKey, subjectKey) => newValue(propertyKey, null, null, null, null, subjectKey)
