// Copyright 2020 Stanford University see LICENSE for license'

import _ from 'lodash'
import { getTagNameForPropertyTemplate } from 'utilities/propertyTemplates'
import { findAuthorityConfigs } from 'utilities/authorityConfig'

export const buildTemplates = (resourceTemplate) => {
  const subjectTemplate = buildSubjectTemplate(resourceTemplate)
  const propertyTemplates = buildPropertyTemplates(resourceTemplate.id, resourceTemplate.propertyTemplates)
  subjectTemplate.propertyTemplateKeys = propertyTemplateKeysFor(propertyTemplates)
  return [subjectTemplate, propertyTemplates]
}

const buildSubjectTemplate = (resourceTemplate) => ({
  // This key will be unique for resource templates
  key: resourceTemplate.id,
  id: resourceTemplate.id,
  class: resourceTemplate.resourceURI,
  label: resourceTemplate.resourceLabel,
  author: resourceTemplate.author,
  remark: resourceTemplate.remark,
  date: resourceTemplate.date,
  propertyTemplateKeys: [],
})

const buildPropertyTemplates = (subjectTemplateKey, propertyTemplates) => propertyTemplates.map((propertyTemplate) => {
  let remarkUrl
  try {
    remarkUrl = new URL(propertyTemplate.remark)
  } catch {
    // Ignore
  }
  const type = typeFor(propertyTemplate)
  return {
    // This key will be unique for resource templates, property templates.
    key: `${subjectTemplateKey} > ${propertyTemplate.propertyURI}`,
    subjectTemplateKey,
    label: propertyTemplate.propertyLabel,
    uri: propertyTemplate.propertyURI,
    required: propertyTemplate.mandatory === 'true',
    repeatable: propertyTemplate.repeatable === 'true',
    defaults: defaultsFor(propertyTemplate, type),
    remark: !remarkUrl ? propertyTemplate.remark : null,
    remarkUrl: remarkUrl || null,
    // resource | uri | literal
    type,
    component: getTagNameForPropertyTemplate(propertyTemplate),
    valueSubjectTemplateKeys: propertyTemplate.valueConstraint?.valueTemplateRefs,
    authorities: buildAuthorities(propertyTemplate),
  }
})

const typeFor = (propertyTemplate) => {
  // const propertyType = _.isEmpty(propertyTemplate?.valueConstraint?.valueTemplateRefs) ? propertyTemplate.type : 'resource'
  if (!_.isEmpty(propertyTemplate?.valueConstraint?.valueTemplateRefs)) {
    return 'resource'
  } if (propertyTemplate.type === 'lookup' || propertyTemplate.type === 'resource') {
    return 'uri'
  }
  return 'literal'
}

const defaultsFor = (propertyTemplate, type) => {
  if (_.isEmpty(propertyTemplate.valueConstraint?.defaults)) return []

  const defaults = propertyTemplate.valueConstraint.defaults.map((defaultItem) => {
    if (type === 'uri' && defaultItem.defaultURI) {
      return {
        uri: defaultItem.defaultURI,
        label: defaultItem.defaultLiteral,
      }
    } if (type === 'literal' && defaultItem.defaultLiteral) {
      return {
        literal: defaultItem.defaultLiteral,
        lang: null,
      }
    }
    return null
  })
  return _.compact(defaults)
}

const propertyTemplateKeysFor = (propertyTemplates) => propertyTemplates.map((propertyTemplate) => propertyTemplate.key)

const buildAuthorities = (propertyTemplate) => {
  const vocabUris = propertyTemplate?.valueConstraint?.useValuesFrom || []

  return findAuthorityConfigs(vocabUris).map((authorityConfig) => ({
    uri: authorityConfig.uri,
    label: authorityConfig.label,
    authority: authorityConfig.authority,
    subauthority: authorityConfig.subauthority,
    nonldLookup: authorityConfig.nonldLookup || false,
  }))
}

// To avoid have to export buildTemplates as default
export const noop = () => {}
