import _ from 'lodash'
import { getTagNameForPropertyTemplate } from 'utilities/propertyTemplates'
import { findAuthorityConfigs, findAuthorityConfig } from 'utilities/authorityConfig'
import rdf from 'rdf-ext'

export const buildTemplates = (dataset, uri) => {
  const resourceTerm = rdf.namedNode(uri)
  const subjectTemplate = buildSubjectTemplate(dataset, resourceTerm)
  const propertyTemplates = buildPropertyTemplates(dataset, resourceTerm, subjectTemplate.key)
  subjectTemplate.propertyTemplateKeys = propertyTemplateKeysFor(propertyTemplates)
  return [subjectTemplate, propertyTemplates]
}

const buildSubjectTemplate = (dataset, subjectTerm) => ({
    // This key will be unique for resource templates
    key: valueFor(dataset, subjectTerm, 'http://sinopia.io/vocabulary/hasResourceId'),
    id: valueFor(dataset, subjectTerm, 'http://sinopia.io/vocabulary/hasResourceId'),
    class: valueFor(dataset, subjectTerm, 'http://sinopia.io/vocabulary/hasClass'),
    label: valueFor(dataset, subjectTerm, 'http://www.w3.org/2000/01/rdf-schema#label'),
    author: valueFor(dataset, subjectTerm, 'http://sinopia.io/vocabulary/hasAuthor'),
    remark: valueFor(dataset, subjectTerm, 'http://sinopia.io/vocabulary/hasRemark'),
    date: valueFor(dataset, subjectTerm, 'http://sinopia.io/vocabulary/hasDate'),
    propertyTemplateKeys: [],
  })

const buildPropertyTemplates = (dataset, subjectTerm, subjectTemplateKey) => {
  const quads = dataset.match(subjectTerm, rdf.namedNode('http://sinopia.io/vocabulary/hasPropertyTemplate')).toArray()
  return quads.map((quad) => buildPropertyTemplate(dataset, quad.object, subjectTemplateKey))
}

const buildPropertyTemplate = (dataset, propertyTerm, subjectTemplateKey) => {
  const propertyType = propertyTypeFor(dataset, propertyTerm)
  if (propertyType === 'literal') return buildLiteralPropertyTemplate(dataset, propertyTerm, subjectTemplateKey)
  if (propertyType === 'uri') return buildUriPropertyTemplate(dataset, propertyTerm, subjectTemplateKey)
  if (propertyType === 'resource') return buildResourcePropertyTemplate(dataset, propertyTerm, subjectTemplateKey)
  return buildLookupPropertyTemplate(dataset, propertyTerm, subjectTemplateKey)
}

const buildLiteralPropertyTemplate = (dataset, propertyTerm, subjectTemplateKey) => {
  const propertyTemplate = buildBasePropertyTemplate(dataset, propertyTerm, subjectTemplateKey)
  propertyTemplate.type = 'literal'
  propertyTemplate.defaults = defaultsForLiteral(dataset, propertyTerm)
  propertyTemplate.component = 'InputLiteral'
  return propertyTemplate
}

const buildUriPropertyTemplate = (dataset, propertyTerm, subjectTemplateKey) => {
  const propertyTemplate = buildBasePropertyTemplate(dataset, propertyTerm, subjectTemplateKey)
  propertyTemplate.type = 'uri'
  propertyTemplate.component = 'InputURI'
  const attributeTerm = objectFor(dataset, propertyTerm, 'http://sinopia.io/vocabulary/hasUriAttributes')
  if (attributeTerm) {
    propertyTemplate.defaults = defaultsForUri(dataset, attributeTerm)
  }
  return propertyTemplate
}

const buildLookupPropertyTemplate = (dataset, propertyTerm, subjectTemplateKey) => {
  const propertyTemplate = buildBasePropertyTemplate(dataset, propertyTerm, subjectTemplateKey)
  propertyTemplate.type = 'uri'
  const attributeTerm = objectFor(dataset, propertyTerm, 'http://sinopia.io/vocabulary/hasLookupAttributes')
  if (attributeTerm) {
    propertyTemplate.defaults = defaultsForUri(dataset, attributeTerm)
    propertyTemplate.authorities = buildAuthorities(dataset, attributeTerm)
    propertyTemplate.component = componentForLookup(propertyTemplate.authorities[0])
  }
  return propertyTemplate
}

const buildResourcePropertyTemplate = (dataset, propertyTerm, subjectTemplateKey) => {
  const propertyTemplate = buildBasePropertyTemplate(dataset, propertyTerm, subjectTemplateKey)
  propertyTemplate.type = 'resource'
  const attributeTerm = objectFor(dataset, propertyTerm, 'http://sinopia.io/vocabulary/hasResourceAttributes')
  if (attributeTerm) {
    propertyTemplate.defaults = defaultsForUri(dataset, attributeTerm)
    propertyTemplate.valueSubjectTemplateKeys = valuesFor(dataset, attributeTerm, 'http://sinopia.io/vocabulary/hasResourceTemplateId')
  }
  return propertyTemplate
}


const buildBasePropertyTemplate = (dataset, propertyTerm, subjectTemplateKey) => {
  const propertyUri = valueFor(dataset, propertyTerm, 'http://sinopia.io/vocabulary/hasPropertyType')
  const cardinalityValues = valuesFor(dataset, propertyTerm, 'http://sinopia.io/vocabulary/hasCardinality')
  return {
    // This key will be unique for resource templates, property templates.
    key: `${subjectTemplateKey} > ${propertyUri}`,
    subjectTemplateKey,
    label: valueFor(dataset, propertyTerm, 'http://www.w3.org/2000/01/rdf-schema#label'),
    uri: propertyUri,
    required: cardinalityValues.includes('http://sinopia.io/vocabulary/cardinality/required'),
    repeatable: cardinalityValues.includes('http://sinopia.io/vocabulary/cardinality/repeatable'),
    remark: valueFor(dataset, propertyTerm, 'http://sinopia.io/vocabulary/hasRemark'),
    remarkUrl: valueFor(dataset, propertyTerm, 'http://sinopia.io/vocabulary/hasRemarkUrl'),
    defaults: [],
    valueSubjectTemplateKeys: [],
    authorities: [],
  }
}


const propertyTypeFor = (dataset, propertyTerm) => {
  return dataset.match(propertyTerm, rdf.namedNode('http://sinopia.io/vocabulary/hasPropertyType')).toArray()[0].object.value.substring(42)
}

const defaultsForLiteral = (dataset, propertyTerm) => {
  const attributeTerm = objectFor(dataset, propertyTerm, 'http://sinopia.io/vocabulary/hasLiteralAttributes')
  if(!attributeTerm) return []

  const defaultTerms = objectsFor(dataset, attributeTerm, 'http://sinopia.io/vocabulary/hasDefault')
  return defaultTerms.map((defaultTerm) => {
    return {
      literal: defaultTerm.value,
      lang: defaultTerm.language
    }
  })
}

const defaultsForUri = (dataset, attributeTerm) => {
  const defaultTerms = objectsFor(dataset, attributeTerm, 'http://sinopia.io/vocabulary/hasDefault')
  return defaultTerms.map((defaultTerm) => {
    return {
      uri: valueFor(dataset, defaultTerm, 'http://sinopia.io/vocabulary/hasUri'),
      label: valueFor(dataset, defaultTerm, 'http://www.w3.org/2000/01/rdf-schema#label')
    }
  })
}

const propertyTemplateKeysFor = (propertyTemplates) => propertyTemplates.map((propertyTemplate) => propertyTemplate.key)

const buildAuthorities = (dataset, propertyTerm) => {
  const vocabUris = valuesFor(dataset, propertyTerm, 'http://sinopia.io/vocabulary/hasAuthority')

  return findAuthorityConfigs(vocabUris).map((authorityConfig) => ({
    uri: authorityConfig.uri,
    label: authorityConfig.label,
    authority: authorityConfig.authority,
    subauthority: authorityConfig.subauthority,
    nonldLookup: authorityConfig.nonldLookup || false,
  }))
}

const componentForLookup = (vocabUri) => {
  const config = findAuthorityConfig(vocabUri)
  switch (config) {
    case 'local-lookup':
      return 'InputLookupSinopia'
    case 'lookup':
      return 'InputLookupQA'
    default:
      return 'InputListLOC'
  }
}

const valueFor = (dataset, subjectTerm, property) => {
  const quads = dataset.match(subjectTerm, rdf.namedNode(property)).toArray()
  if (_.isEmpty(quads)) return null
  return quads[0].object.value
}

const objectFor = (dataset, subjectTerm, property) => {
  const quads = dataset.match(subjectTerm, rdf.namedNode(property)).toArray()
  if (_.isEmpty(quads)) return null
  return quads[0].object
}


const valuesFor = (dataset, subjectTerm, property) => {
  const quads = dataset.match(subjectTerm, rdf.namedNode(property)).toArray()
  return quads.map((quad) => quad.object.value)
}

const objectsFor = (dataset, subjectTerm, property) => {
  const quads = dataset.match(subjectTerm, rdf.namedNode(property)).toArray()
  return quads.map((quad) => quad.object)
}

// To avoid have to export buildTemplates as default
export const noop = () => {}
