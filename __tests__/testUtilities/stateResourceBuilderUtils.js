import _ from "lodash"

/**
 * Helper for building resources (and parts) and templates as represented in state.
 */
export default class StateResourceBuilder {
  subjectTemplate({
    id,
    clazz,
    uri = null,
    label,
    author = null,
    remark = null,
    date = null,
    propertyTemplateKeys,
    suppressible = false,
    group = "stanford",
    editGroups = ["cornell"],
  }) {
    assertProps({ id, clazz, label, propertyTemplateKeys })
    return {
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
      propertyTemplateKeys,
    }
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
    resourceKey = null,
    group = "stanford",
    editGroups = ["cornell"],
    bfAdminMetadataRefs = [],
    bfItemRefs = [],
    bfInstanceRefs = [],
    bfWorkRefs = [],
    changed = false,
    label = null,
    ...props
  }) {
    return {
      ...this.subject(props),
      uri,
      resourceKey: resourceKey || props?.key,
      group,
      editGroups,
      bfAdminMetadataRefs,
      bfItemRefs,
      bfInstanceRefs,
      bfWorkRefs,
      changed,
      label: label || _.first(props?.labels),
    }
  }

  subject({
    key,
    subjectTemplateKey,
    propertyKeys,
    labels,
    showNav = false,
    uri = null,
    rootSubjectKey = null,
    rootPropertyKey = null,
    descUriOrLiteralValueKeys = [],
    descWithErrorPropertyKeys = [],
  }) {
    assertProps({ key, subjectTemplateKey, propertyKeys, labels })
    return {
      key,
      subjectTemplateKey,
      propertyKeys,
      uri,
      showNav,
      labels,
      rootSubjectKey: rootSubjectKey || key,
      rootPropertyKey,
      descUriOrLiteralValueKeys,
      descWithErrorPropertyKeys,
    }
  }

  property({
    key,
    subjectKey,
    rootSubjectKey = null,
    rootPropertyKey = null,
    propertyTemplateKey,
    valueKeys = [],
    show = true,
    showNav = false,
    descUriOrLiteralValueKeys = [],
    descWithErrorPropertyKeys = [],
    labels,
    propertyUri = null,
  }) {
    assertProps({ key, subjectKey, propertyTemplateKey, labels })
    return {
      key,
      subjectKey,
      rootSubjectKey: rootSubjectKey || subjectKey,
      rootPropertyKey: rootPropertyKey || key,
      propertyTemplateKey,
      valueKeys,
      show,
      showNav,
      descUriOrLiteralValueKeys,
      descWithErrorPropertyKeys,
      labels,
      propertyUri,
    }
  }

  // propertyUri is not required when ordered
  orderedValue({
    key,
    propertyKey,
    rootSubjectKey,
    rootPropertyKey = null,
    literal = null,
    lang = null,
    uri = null,
    label = null,
    valueSubjectKey = null,
    errors = [],
    component,
    propertyUri = null,
  }) {
    assertProps({ key, propertyKey, rootSubjectKey, component })
    return {
      key,
      propertyKey,
      rootSubjectKey,
      rootPropertyKey: rootPropertyKey || propertyKey,
      literal,
      lang,
      uri,
      label,
      valueSubjectKey,
      errors,
      component,
      propertyUri,
    }
  }

  value({ propertyUri, ...props }) {
    assertProps({ propertyUri })
    return this.orderedValue({ ...props, propertyUri })
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
    assertProps({ uri, label })
    return this.value({
      uri,
      label,
      lang,
      component: "InputURIValue",
      ...props,
    })
  }

  subjectValue({ valueSubjectKey, ...props }) {
    assertProps({ valueSubjectKey })
    return this.value({
      valueSubjectKey,
      component: null,
      ...props,
    })
  }
}

const assertProps = (props) => {
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined) throw new Error(`${key} is required`)
  })
}
