import _ from 'lodash'
import { getTagNameForPropertyTemplate } from 'utilities/propertyTemplates'
import { findAuthorityConfigs } from 'utilities/authorityConfig'

export const buildTemplates = (resourceTemplate) => {
  let subjectTemplate = buildSubjectTemplate(resourceTemplate)
  let propertyTemplates = buildPropertyTemplates(resourceTemplate.id, resourceTemplate.propertyTemplates)
  subjectTemplate.propertyTemplateKeys = propertyTemplateKeysFor(propertyTemplates)
  propertyTemplates = buildMarcSubfields(resourceTemplate, propertyTemplates)
  subjectTemplate = buildMarcTemplates(resourceTemplate, subjectTemplate)
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

const buildMarcSubfields = (resourceTemplate, propertyTemplates) => {
  resourceTemplate.marcTemplates?.forEach((marcTemplate) => {
    marcTemplate.subfields?.forEach((subfield) => {
      const propertyKey = `${resourceTemplate.id} > ${subfield.propertyURI}`
      propertyTemplates.forEach((propertyTemplate) => {
        if (propertyTemplate.key === propertyKey) {
          const propertySubfield = {
            marcTag: marcTemplate.marcTag,
            code: subfield.code,
            repeatable: subfield.repeatable
          }
          if ('valueSource' in subfield) {
            propertySubfield['valueSource'] = subfield.valueSource
          }
          if ('marcSubfields' in propertyTemplate) {
            propertyTemplate['marcSubfields'].push(propertySubfield)
          } else {
            propertyTemplate['marcSubfields'] = [propertySubfield]
          }
        }
      })
    })
  })
  return propertyTemplates
}

const buildMarcTemplates = (resourceTemplate, subjectTemplate) => {
  resourceTemplate.marcTemplates?.forEach((marcTemplate) => {
    delete marcTemplate.subfields
    if ('marcTemplates' in subjectTemplate) {
      subjectTemplate['marcTemplates'].push(marcTemplate)
    } else {
      subjectTemplate['marcTemplates'] = [marcTemplate]
    }
  })
  return subjectTemplate
}

// To avoid have to export buildTemplates as default
export const noop = () => {}
