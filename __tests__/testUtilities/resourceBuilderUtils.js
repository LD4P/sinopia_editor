import _ from "lodash"
import { findAuthorityConfig } from "utilities/authorityConfig"

/**
 * Helper for building resources (and parts) and templates.
 */
export default class ResourceBuilder {
  constructor({ injectPropertyIntoValue = false } = {}) {
    this.injectPropertyIntoValue = injectPropertyIntoValue
  }

  key() {
    return "abc123"
  }

  subjectTemplate({
    id,
    clazz,
    uri = null,
    label = null,
    author = null,
    remark = null,
    date = null,
    propertyTemplates = [],
    propertyTemplateKeys = [],
    suppressible = false,
    group = "stanford",
    editGroups = ["cornell"],
  }) {
    assertProps({ id, clazz })
    const template = {
      key: id,
      id,
      class: clazz,
      uri,
      label,
      author,
      remark,
      date,
      suppressible,
      group,
      editGroups,
    }

    if (!_.isEmpty(propertyTemplateKeys)) {
      template.propertyTemplateKeys = propertyTemplateKeys
    } else {
      template.propertyTemplates = propertyTemplates
      template.propertyTemplateKeys = propertyTemplates.map(
        (template) => template.key
      )
    }
    return template
  }

  propertyTemplate({
    subjectTemplateKey,
    label,
    uris,
    required = false,
    repeatable = false,
    ordered = false,
    immutable = false,
    languageSuppressed = false,
    remark = null,
    remarkUrl = null,
    remarkUrlLabel = null,
    defaults = [],
    valueSubjectTemplateKeys = [],
    authorities = [],
    type,
    component,
  }) {
    assertProps({ subjectTemplateKey, label, uris, type, component })
    return {
      key: `${subjectTemplateKey} > ${Object.keys(uris).join(", ")}`,
      subjectTemplateKey,
      label,
      uris,
      defaultUri: _.first(Object.keys(uris)),
      required,
      repeatable,
      ordered,
      immutable,
      languageSuppressed,
      remark,
      remarkUrl,
      remarkUrlLabel,
      defaults,
      valueSubjectTemplateKeys,
      authorities,
      type,
      component,
    }
  }

  resource({
    uri = null,
    group = "stanford",
    editGroups = ["cornell"],
    ...props
  }) {
    return {
      ...this.subject(props),
      uri,
      group,
      editGroups,
    }
  }

  subject({ subjectTemplate, properties, uri = null }) {
    assertProps({ subjectTemplate, properties })
    return {
      key: this.key(),
      subjectTemplate,
      properties,
      uri,
    }
  }

  // The subjectTemplates for ordered subjects (after the first) are removed by safeStringify
  orderedSubject({ properties, uri = null }) {
    assertProps({ properties })
    return {
      key: this.key(),
      properties,
      uri,
    }
  }

  property({
    key = null,
    propertyTemplate = null,
    propertyTemplateKey = null,
    values = null,
    propertyUri = null,
    show = false,
    subjectKey = null,
  } = {}) {
    const property = {
      key: key || this.key(),
      values,
      propertyUri,
      show,
    }

    if (propertyTemplate) property.propertyTemplate = propertyTemplate
    if (propertyTemplateKey) property.propertyTemplateKey = propertyTemplateKey
    if (subjectKey) property.subjectKey = subjectKey

    // Inject property into value
    if (!_.isEmpty(values) && this.injectPropertyIntoValue)
      values.forEach((value) => (value.propertyKey = property.key))

    return property
  }

  literalProperty({ propertyTemplate = {}, ...props }) {
    return this.property({
      ...props,
      propertyTemplate: { ...propertyTemplate, type: "literal" },
    })
  }

  uriProperty({ propertyTemplate = {}, ...props }) {
    return this.property({
      ...props,
      propertyTemplate: { ...propertyTemplate, type: "uri" },
    })
  }

  resourceProperty({ propertyTemplate = {}, ...props }) {
    return this.property({
      ...props,
      propertyTemplate: { ...propertyTemplate, type: "resource" },
    })
  }

  literalValue({ literal, lang = "eng", ...props }) {
    assertProps({ literal })

    return this.value({
      literal,
      lang,
      component: "InputLiteralValue",
      ...props,
    })
  }

  uriValue({ uri, label, lang = "eng", ...props }) {
    assertProps({ uri })
    return this.value({
      uri,
      label,
      lang,
      component: "InputURIValue",
      ...props,
    })
  }

  subjectValue({ valueSubject, ...props }) {
    assertProps({ valueSubject })
    return this.value({ valueSubject, ...props })
  }

  value({
    literal = null,
    lang = null,
    uri = null,
    label = null,
    valueSubject = null,
    component = null,
    propertyUri = null,
    propertyKey = null,
  }) {
    return {
      key: this.key(),
      literal,
      lang,
      uri,
      label,
      valueSubject,
      propertyUri,
      component,
      propertyKey,
    }
  }

  authority(uri) {
    const config = _.pick(findAuthorityConfig(uri), [
      "uri",
      "label",
      "authority",
      "subauthority",
      "nonldLookup",
    ])
    if (!config.nonldLookup) config.nonldLookup = false

    return config
  }
}

const assertProps = (props) => {
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined) throw new Error(`${key} is required`)
  })
}
