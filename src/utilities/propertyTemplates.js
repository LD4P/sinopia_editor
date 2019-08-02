
import lookupConfig from '../../static/lookupConfig.json'
import shortid from 'shortid'
import { defaultLanguageId } from 'Utilities'

export const getTagNameForPropertyTemplate = (propertyTemplate) => {
  let config

  // We do not support mixed list and lookups, so we will just go with the value of the first config item found
  try {
    config = getLookupConfigItems(propertyTemplate)[0].component
  } catch {
    // Ignore undefined configuration
  }

  switch (config) {
    case 'local-lookup':
      return 'InputLookupSinopia'
    case 'lookup':
      return 'InputLookupQA'
    case 'list':
      return 'InputListLOC'
    default:
      return textFieldType(config, propertyTemplate)
  }
}

const textFieldType = (config, propertyTemplate) => {
  switch (propertyTemplate.type) {
    case 'literal':
      return 'InputLiteral'
    case 'resource':
      return 'InputURI'
    default:
      // error case handled by caller
      return null
  }
}

export const defaultValuesFromPropertyTemplate = (propertyTemplate) => {
  const defaults = propertyTemplate?.valueConstraint?.defaults || []
  const defaultValues = {}
  defaults.forEach((defaultValue) => {
    // Use the default URI for the literal value if the literal is undefined
    const defaultLiteral = defaultValue?.defaultLiteral

    const defaultURI = defaultValue?.defaultURI

    const defaultLabel = defaultLiteral || defaultURI

    if (!defaultValue || !defaultLabel) return

    if (propertyTemplate.type !== 'literal') {
      defaultValues[shortid.generate()] = {
        label: defaultLabel,
        uri: defaultValue.defaultURI,
      }
    } else {
      defaultValues[shortid.generate()] = {
        content: defaultLabel,
        lang: defaultLanguageId,
      }
    }
  })
  return defaultValues
}

export const booleanPropertyFromTemplate = (template, key, defaultValue) => {
  // Use safe navigation for dynamic properties: https://github.com/tc39/proposal-optional-chaining#syntax
  const propertyValue = template?.[key]

  if (!propertyValue) return defaultValue

  const parsedValue = JSON.parse(propertyValue)

  if (parsedValue !== true && parsedValue !== false) return defaultValue

  return parsedValue
}


export const getLookupConfigItems = (propertyTemplate) => {
  const vocabUriList = propertyTemplate?.valueConstraint?.useValuesFrom

  if (vocabUriList === undefined || vocabUriList.length === 0) return []

  return lookupConfig.filter(configItem => vocabUriList.includes(configItem.uri))
}
