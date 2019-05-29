// Copyright 2018, 2019 Stanford University see LICENSE for license

const _ = require('lodash')

export const isResourceWithValueTemplateRef = property => {
  return property?.type === 'resource' &&
    property?.valueConstraint?.valueTemplateRefs?.length > 0
}

export const resourceToName = uri => {
  if (!_.isString(uri))
    return undefined

  return uri.substr(uri.lastIndexOf('/') + 1)
}


export const defaultValuesFromPropertyTemplate = propertyTemplate => {
  // Use safe navigation to deal with differently shaped property templates
  const defaultValue = propertyTemplate?.valueConstraint?.defaults?.[0]

  if (!defaultValue)
    return []

  return [{
    id: defaultValue.defaultURI,
    label: defaultValue.defaultLiteral,
    uri: defaultValue.defaultURI
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
