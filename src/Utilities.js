// Copyright 2018, 2019 Stanford University see LICENSE for license

const _ = require('lodash')

export const isResourceWithValueTemplateRef = property => property?.type === 'resource'
    && property?.valueConstraint?.valueTemplateRefs?.length > 0

export const resourceToName = (uri) => {
  if (!_.isString(uri)) return undefined

  return uri.substr(uri.lastIndexOf('/') + 1)
}


export const defaultValuesFromPropertyTemplate = (propertyTemplate) => {
  // Use safe navigation to deal with differently shaped property templates
  const defaultValue = propertyTemplate?.valueConstraint?.defaults?.[0]

  // Use the default URI for the literal value if the lliteral is undefined
  const defaultLiteral = defaultValue?.defaultLiteral

  const defaultURI = defaultValue?.defaultURI

  const defaultLabel = defaultLiteral || defaultURI

  if (!defaultValue) return []

  return [{
    id: defaultValue.defaultURI,
    label: defaultLabel,
    uri: defaultValue.defaultURI,
  }]
}

export const templateBoolean = (value) => {
  let result

  switch (value) {
    case 'true':
    case true:
      result = true
      break
    case 'false':
    case false:
      result = false
      break
    default:
      result = true
  }

  return Boolean(result)
}

export const booleanPropertyFromTemplate = (template, key, defaultValue) => {
  // Use safe navigation for dynamic properties: https://github.com/tc39/proposal-optional-chaining#syntax
  const propertyValue = template?.[key]

  if (!propertyValue) return defaultValue

  const parsedValue = JSON.parse(propertyValue)

  if (parsedValue !== true && parsedValue !== false) return defaultValue

  return parsedValue
}

export const defaultLangTemplate = () => ({
  items: [
    {
      id: 'http://id.loc.gov/vocabulary/languages/eng',
      label: 'English',
      uri: 'http://id.loc.gov/vocabulary/languages/eng',
    },
  ],
})
