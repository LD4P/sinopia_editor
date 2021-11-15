import _ from "lodash"
import { findAuthorityConfig } from "utilities/authorityConfig"
import rdf from "rdf-ext"

const rdfsLabel = "http://www.w3.org/2000/01/rdf-schema#label"

export default class TemplatesBuilder {
  constructor(dataset, uri, group = null, editGroups = []) {
    this.dataset = dataset
    this.uri = uri
    this.resourceTerm = rdf.namedNode(uri)
    this.subjectTemplate = null
    this.group = group
    this.editGroups = editGroups
  }

  /**
   * @return {Object} subject template
   */
  build() {
    this.buildSubjectTemplate()
    this.buildPropertyTemplates()
    return this.subjectTemplate
  }

  buildSubjectTemplate() {
    const resourceAttrValues = this.valuesFor(
      this.resourceTerm,
      "http://sinopia.io/vocabulary/hasResourceAttribute"
    )
    this.subjectTemplate = {
      // This key will be unique for resource templates
      key: this.valueFor(
        this.resourceTerm,
        "http://sinopia.io/vocabulary/hasResourceId"
      ),
      uri: _.isEmpty(this.uri) ? null : this.uri,
      id: this.valueFor(
        this.resourceTerm,
        "http://sinopia.io/vocabulary/hasResourceId"
      ),
      class: this.valueFor(
        this.resourceTerm,
        "http://sinopia.io/vocabulary/hasClass"
      ),
      label: this.valueFor(this.resourceTerm, rdfsLabel),
      author: this.valueFor(
        this.resourceTerm,
        "http://sinopia.io/vocabulary/hasAuthor"
      ),
      remark: this.valueFor(
        this.resourceTerm,
        "http://sinopia.io/vocabulary/hasRemark"
      ),
      date: this.valueFor(
        this.resourceTerm,
        "http://sinopia.io/vocabulary/hasDate"
      ),
      suppressible: resourceAttrValues.includes(
        "http://sinopia.io/vocabulary/resourceAttribute/suppressible"
      ),
      propertyTemplateKeys: [],
      propertyTemplates: [],
      group: this.group,
      editGroups: this.editGroups,
    }
  }

  buildPropertyTemplates() {
    // Property templates is a list.
    const quads = this.dataset
      .match(
        this.subjectTerm,
        rdf.namedNode("http://sinopia.io/vocabulary/hasPropertyTemplate")
      )
      .toArray()
    if (_.isEmpty(quads)) return
    const objects = []
    this.buildList(quads[0].object, objects)
    objects.forEach((obj) => this.buildPropertyTemplate(obj))
  }

  buildList(subjectTerm, objects) {
    objects.push(
      this.dataset
        .match(
          subjectTerm,
          rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#first")
        )
        .toArray()[0].object
    )
    const restQuad = this.dataset
      .match(
        subjectTerm,
        rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#rest")
      )
      .toArray()[0]
    if (
      restQuad.object.value !== "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"
    )
      this.buildList(restQuad.object, objects)
  }

  buildPropertyTemplate(propertyTerm) {
    const propertyType = this.propertyTypeFor(propertyTerm)
    let propertyTemplate
    if (propertyType === "literal") {
      propertyTemplate = this.newLiteralPropertyTemplate(propertyTerm)
    } else if (
      propertyType === "uri" &&
      this.objectFor(
        propertyTerm,
        "http://sinopia.io/vocabulary/hasLookupAttributes"
      )
    ) {
      propertyTemplate = this.newLookupPropertyTemplate(propertyTerm)
    } else if (propertyType === "resource") {
      propertyTemplate = this.newResourcePropertyTemplate(propertyTerm)
    } else {
      propertyTemplate = this.newUriPropertyTemplate(propertyTerm)
    }
    this.subjectTemplate.propertyTemplates.push(propertyTemplate)
    this.subjectTemplate.propertyTemplateKeys.push(propertyTemplate.key)
  }

  newLiteralPropertyTemplate(propertyTerm) {
    const propertyTemplate = this.newBasePropertyTemplate(propertyTerm)
    propertyTemplate.type = "literal"
    propertyTemplate.defaults = this.defaultsForLiteral(propertyTerm)
    propertyTemplate.validationRegex =
      this.validationRegexForLiteral(propertyTerm)
    const validationDataType = this.validationDataTypeForLiteral(propertyTerm)
    if (validationDataType) {
      propertyTemplate.languageSuppressed = true
      propertyTemplate.validationDataType = validationDataType
    }
    propertyTemplate.component = "InputLiteral"
    return propertyTemplate
  }

  newUriPropertyTemplate(propertyTerm) {
    const propertyTemplate = this.newBasePropertyTemplate(propertyTerm)
    propertyTemplate.type = "uri"
    propertyTemplate.component = "InputURI"
    const attributeTerm = this.objectFor(
      propertyTerm,
      "http://sinopia.io/vocabulary/hasUriAttributes"
    )
    if (attributeTerm) {
      propertyTemplate.defaults = this.defaultsForUri(attributeTerm)
    }
    return propertyTemplate
  }

  newBasePropertyTemplate(propertyTerm) {
    const propertyUriTerms = this.objectsFor(
      propertyTerm,
      "http://sinopia.io/vocabulary/hasPropertyUri"
    )
    const propertyUrisMap = {}
    propertyUriTerms.forEach((propertyUriTerm) => {
      const label = this.valueFor(propertyUriTerm, rdfsLabel)
      propertyUrisMap[propertyUriTerm.value] = label || propertyUriTerm.value
    })
    const propertyAttrValues = this.valuesFor(
      propertyTerm,
      "http://sinopia.io/vocabulary/hasPropertyAttribute"
    )
    const remarkUrl = this.valueFor(
      propertyTerm,
      "http://sinopia.io/vocabulary/hasRemarkUrl"
    )
    const remarkUrlLabel = remarkUrl
      ? this.valueFor(remarkUrl, rdfsLabel)
      : null

    return {
      // This key will be unique for resource templates, property templates.
      key: `${this.subjectTemplate.key} > ${Object.keys(propertyUrisMap)
        .sort()
        .join(", ")}`,
      subjectTemplateKey: this.subjectTemplate.key,
      label: this.valueFor(propertyTerm, rdfsLabel),
      uris: propertyUrisMap,
      defaultUri: _.first(Object.keys(propertyUrisMap)),
      required: propertyAttrValues.includes(
        "http://sinopia.io/vocabulary/propertyAttribute/required"
      ),
      repeatable: propertyAttrValues.includes(
        "http://sinopia.io/vocabulary/propertyAttribute/repeatable"
      ),
      ordered: propertyAttrValues.includes(
        "http://sinopia.io/vocabulary/propertyAttribute/ordered"
      ),
      immutable: propertyAttrValues.includes(
        "http://sinopia.io/vocabulary/propertyAttribute/immutable"
      ),
      languageSuppressed: propertyAttrValues.includes(
        "http://sinopia.io/vocabulary/propertyAttribute/languageSuppressed"
      ),
      remark: this.valueFor(
        propertyTerm,
        "http://sinopia.io/vocabulary/hasRemark"
      ),
      validationRegex: null,
      validationDataType: null,
      remarkUrl,
      remarkUrlLabel,
      defaults: [],
      valueSubjectTemplateKeys: [],
      authorities: [],
    }
  }

  newResourcePropertyTemplate(propertyTerm) {
    const propertyTemplate = this.newBasePropertyTemplate(propertyTerm)
    propertyTemplate.type = "resource"
    const attributeTerm = this.objectFor(
      propertyTerm,
      "http://sinopia.io/vocabulary/hasResourceAttributes"
    )
    if (attributeTerm) {
      propertyTemplate.defaults = this.defaultsForUri(attributeTerm)
      propertyTemplate.valueSubjectTemplateKeys = this.valuesFor(
        attributeTerm,
        "http://sinopia.io/vocabulary/hasResourceTemplateId"
      )
      propertyTemplate.component = "NestedResource"
    }
    return propertyTemplate
  }

  newLookupPropertyTemplate(propertyTerm) {
    const propertyTemplate = this.newBasePropertyTemplate(propertyTerm)
    propertyTemplate.type = "uri"
    const attributeTerm = this.objectFor(
      propertyTerm,
      "http://sinopia.io/vocabulary/hasLookupAttributes"
    )
    if (attributeTerm) {
      propertyTemplate.defaults = this.defaultsForUri(attributeTerm)
      propertyTemplate.authorities = this.newAuthorities(attributeTerm)
      propertyTemplate.component = this.componentForLookup(
        propertyTemplate.authorities[0].uri
      )
    }
    return propertyTemplate
  }

  valueFor(subjectTerm, property) {
    const quads = this.dataset
      .match(subjectTerm, rdf.namedNode(property))
      .toArray()
    if (_.isEmpty(quads)) return null
    return quads[0].object.value
  }

  propertyTypeFor(propertyTerm) {
    return this.dataset
      .match(
        propertyTerm,
        rdf.namedNode("http://sinopia.io/vocabulary/hasPropertyType")
      )
      .toArray()[0]
      .object.value.substring(42)
  }

  objectFor(subjectTerm, property) {
    const quads = this.dataset
      .match(subjectTerm, rdf.namedNode(property))
      .toArray()
    if (_.isEmpty(quads)) return null
    return quads[0].object
  }

  valuesFor(subjectTerm, property) {
    const quads = this.dataset
      .match(subjectTerm, rdf.namedNode(property))
      .toArray()
    return quads.map((quad) => quad.object.value)
  }

  objectsFor(subjectTerm, property) {
    const quads = this.dataset
      .match(subjectTerm, rdf.namedNode(property))
      .toArray()
    return quads.map((quad) => quad.object)
  }

  defaultsForLiteral(propertyTerm) {
    const attributeTerm = this.objectFor(
      propertyTerm,
      "http://sinopia.io/vocabulary/hasLiteralAttributes"
    )
    if (!attributeTerm) return []

    const defaultTerms = this.objectsFor(
      attributeTerm,
      "http://sinopia.io/vocabulary/hasDefault"
    )
    return defaultTerms.map((defaultTerm) => ({
      literal: defaultTerm.value,
      lang: _.isEmpty(defaultTerm.language) ? null : defaultTerm.language,
    }))
  }

  validationRegexForLiteral(propertyTerm) {
    const attributeTerm = this.objectFor(
      propertyTerm,
      "http://sinopia.io/vocabulary/hasLiteralAttributes"
    )
    if (!attributeTerm) return null
    return this.valueFor(
      attributeTerm,
      "http://sinopia.io/vocabulary/hasValidationRegex"
    )
  }

  validationDataTypeForLiteral(propertyTerm) {
    const attributeTerm = this.objectFor(
      propertyTerm,
      "http://sinopia.io/vocabulary/hasLiteralAttributes"
    )
    if (!attributeTerm) return null
    return this.valueFor(
      attributeTerm,
      "http://sinopia.io/vocabulary/hasValidationDataType"
    )
  }

  defaultsForUri(attributeTerm) {
    const defaultTerms = this.objectsFor(
      attributeTerm,
      "http://sinopia.io/vocabulary/hasDefault"
    )
    return defaultTerms.map((defaultTerm) => {
      const defaultLabelTerm = this.objectFor(
        defaultTerm,
        "http://www.w3.org/2000/01/rdf-schema#label"
      )
      return {
        uri: this.valueFor(defaultTerm, "http://sinopia.io/vocabulary/hasUri"),
        label: defaultLabelTerm?.value || null,
        lang: _.isEmpty(defaultLabelTerm?.language)
          ? null
          : defaultLabelTerm.language,
      }
    })
  }

  newAuthorities(propertyTerm) {
    const vocabUris = this.valuesFor(
      propertyTerm,
      "http://sinopia.io/vocabulary/hasAuthority"
    )

    return vocabUris.map((vocabUri) => {
      const authority = {
        uri: vocabUri,
      }
      const authorityConfig = findAuthorityConfig(vocabUri)
      if (authorityConfig) {
        authority.label = authorityConfig.label
        if (authorityConfig.authority)
          authority.authority = authorityConfig.authority
        if (authorityConfig.subauthority !== undefined)
          authority.subauthority = authorityConfig.subauthority
        authority.nonldLookup = authorityConfig.nonldLookup || false
        if (authorityConfig.type) authority.type = authorityConfig.type
      }
      return authority
    })
  }

  componentForLookup(vocabUri) {
    const config = findAuthorityConfig(vocabUri)
    switch (config?.component) {
      case "local-lookup":
      case "lookup":
        return "InputLookup"
      default:
        return "InputList"
    }
  }
}
