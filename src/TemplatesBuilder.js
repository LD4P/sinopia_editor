// Copyright 2020 Stanford University see LICENSE for license'

import _ from 'lodash'
import { getTagNameForPropertyTemplate } from 'utilities/propertyTemplates'
import { findAuthorityConfig } from 'utilities/authorityConfig'

export default class TemplatesBuilder {
  constructor(resourceTemplate) {
    this.resourceTemplate = resourceTemplate
    this.subjectTemplate = null
  }

  /**
   * @return {Object} subject template
   */
  build() {
    this.buildSubjectTemplate()
    this.resourceTemplate.propertyTemplates.forEach((propertyTemplate) => this.buildPropertyTemplate(propertyTemplate))
    return this.subjectTemplate
  }

  buildSubjectTemplate() {
    const template = {
      // This key will be unique for resource templates
      key: this.resourceTemplate.id,
      id: this.resourceTemplate.id,
      class: this.resourceTemplate.resourceURI,
      label: this.resourceTemplate.resourceLabel,
      author: this.resourceTemplate.author,
      remark: this.resourceTemplate.remark,
      date: this.resourceTemplate.date,
      propertyTemplateKeys: [],
      propertyTemplates: [],
    }
    this.subjectTemplate = template
  }

  buildPropertyTemplate(propertyTemplate) {
    const remarkUrl = this.remarkUrlFor(propertyTemplate.remark)
    const type = this.typeFor(propertyTemplate)
    const template = {
      // This key will be unique for resource templates, property templates.
      key: `${this.subjectTemplate.key} > ${propertyTemplate.propertyURI}`,
      subjectTemplateKey: this.subjectTemplate.key,
      label: propertyTemplate.propertyLabel,
      uri: propertyTemplate.propertyURI,
      required: propertyTemplate.mandatory === 'true',
      repeatable: propertyTemplate.repeatable === 'true',
      defaults: this.defaultsFor(propertyTemplate, type),
      remark: !remarkUrl ? propertyTemplate.remark : null,
      remarkUrl: remarkUrl || null,
      // resource | uri | literal
      type,
      component: this.componentFor(propertyTemplate, type),
      valueSubjectTemplateKeys: this.valueSubjectTemplateKeysFor(propertyTemplate),
      authorities: this.buildAuthorities(propertyTemplate),
    }
    this.subjectTemplate.propertyTemplates.push(template)
    this.subjectTemplate.propertyTemplateKeys.push(template.key)
  }

  remarkUrlFor(remark) {
    let remarkUrl
    try {
      remarkUrl = new URL(remark)
    } catch {
      // Ignore
    }
    return remarkUrl
  }

  componentFor(propertyTemplate, type) {
    let component = null
    if (type === 'resource') return 'NestedResource'
    try {
      component = getTagNameForPropertyTemplate(propertyTemplate)
    } catch {
      // Ignore
    }
    return component
  }

  typeFor(propertyTemplate) {
    if (!_.isEmpty(propertyTemplate?.valueConstraint?.valueTemplateRefs) && propertyTemplate.type === 'resource') {
      return 'resource'
    }
    if (propertyTemplate.type === 'lookup' || propertyTemplate.type === 'resource') {
      return 'uri'
    }
    if (propertyTemplate.type === 'literal') {
      return 'literal'
    }
    return null
  }

  valueSubjectTemplateKeysFor(propertyTemplate) {
    const valueTemplateRefs = propertyTemplate.valueConstraint?.valueTemplateRefs
    if (!valueTemplateRefs) return null

    // Remove blanks
    return valueTemplateRefs.filter((valueTemplateRef) => !_.isEmpty(valueTemplateRef))
  }

  defaultsFor(propertyTemplate, type) {
    if (_.isEmpty(propertyTemplate.valueConstraint?.defaults) || !type) return []

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

  buildAuthorities(propertyTemplate) {
    const vocabUris = propertyTemplate?.valueConstraint?.useValuesFrom || []

    return vocabUris.map((vocabUri) => {
      const authorityConfig = findAuthorityConfig(vocabUri)
      if (!authorityConfig) return { uri: vocabUri }
      return {
        uri: authorityConfig.uri,
        label: authorityConfig.label,
        authority: authorityConfig.authority,
        subauthority: authorityConfig.subauthority,
        nonldLookup: authorityConfig.nonldLookup || false,
      }
    })
  }
}
