// Copyright 2018, 2019 Stanford University see LICENSE for license
import _ from "lodash"
import {
  selectSubjectTemplate,
  selectPropertyTemplate,
} from "selectors/templates"
import Config from "Config"

// Always use selectNormSubject/Property/Value in components.
// selectSubject/Property/Value can be used in actionCreators.
// Only use selectFullSubject/Property/Value where absolutely necessary, since expensive to create.

export const selectSubject = (state, key) => {
  const subject = selectNormSubject(state, key)
  if (_.isEmpty(subject)) return null

  const newSubject = { ...subject }
  newSubject.subjectTemplate = selectSubjectTemplate(
    state,
    newSubject.subjectTemplateKey
  )
  newSubject.properties = newSubject.propertyKeys.map((propertyKey) =>
    selectNormProperty(state, propertyKey)
  )
  return newSubject
}

export const selectProperty = (state, key) => {
  const property = selectNormProperty(state, key)
  if (_.isEmpty(property)) return null

  const newProperty = { ...property }
  const newSubject = selectNormSubject(state, newProperty.subjectKey)
  newSubject.subjectTemplate = selectSubjectTemplate(
    state,
    newSubject.subjectTemplateKey
  )

  newProperty.subject = newSubject
  newProperty.propertyTemplate = selectPropertyTemplate(
    state,
    newProperty.propertyTemplateKey
  )
  newProperty.values = null
  if (property.valueKeys) {
    newProperty.values = newProperty.valueKeys.map((valueKey) => {
      const newValue = { ...selectValue(state, valueKey) }
      newValue.property = newProperty
      return newValue
    })
  }
  return newProperty
}

export const selectValue = (state, key) => {
  const value = selectNormValue(state, key)
  if (_.isEmpty(value)) return null

  const newValue = { ...value }
  const property = selectNormProperty(state, newValue.propertyKey)
  const newProperty = { ...property }
  newProperty.propertyTemplate = selectPropertyTemplate(
    state,
    newProperty.propertyTemplateKey
  )
  newValue.property = newProperty
  newValue.valueSubject = selectSubject(state, newValue.valueSubjectKey)
  return newValue
}

export const selectNormSubject = (state, key) => state.entities.subjects[key]

export const selectNormProperty = (state, key) => state.entities.properties[key]

export const selectNormValue = (state, key) => state.entities.values[key]

export const selectCurrentResourceKey = (state) => state.editor.currentResource

export const selectCurrentPreviewResourceKey = (state) =>
  state.editor.currentPreviewResource

export const selectCurrentDiffResourceKeys = (state) => state.editor.currentDiff

export const selectFullSubject = (state, key) => {
  const subject = selectNormSubject(state, key)
  if (_.isEmpty(subject)) return null

  const newSubject = { ...subject }
  newSubject.subjectTemplate = selectSubjectTemplate(
    state,
    newSubject.subjectTemplateKey
  )
  newSubject.properties = newSubject.propertyKeys.map((propertyKey) =>
    selectFullProperty(state, propertyKey, newSubject)
  )
  return newSubject
}

export const selectFullProperty = (state, key, subject) => {
  const property = selectNormProperty(state, key)
  if (_.isEmpty(property)) return null

  const newProperty = { ...property }
  newProperty.subject = subject
  newProperty.propertyTemplate = selectPropertyTemplate(
    state,
    newProperty.propertyTemplateKey
  )
  newProperty.values = null
  if (property.valueKeys)
    newProperty.values = newProperty.valueKeys.map((valueKey) =>
      selectFullValue(state, valueKey, newProperty)
    )
  return newProperty
}

const selectFullValue = (state, key, property) => {
  const value = selectNormValue(state, key)
  if (_.isEmpty(value)) return null

  const newValue = { ...value }
  newValue.property = property
  newValue.valueSubject = selectFullSubject(state, newValue.valueSubjectKey)
  return newValue
}

/**
 * Determines if a resource has been changed since it was last saved.
 * @param {Object} state the redux state
 * @param {string} resourceKey of the resource to check; if omitted, current resource key is used
 * @return {true} true if the resource has changed
 */
export const resourceHasChangesSinceLastSave = (state, resourceKey) => {
  const thisResourceKey = resourceKey || selectCurrentResourceKey(state)
  return state.entities.subjects[thisResourceKey].changed
}

export const selectResourceKeys = (state) => state.editor.resources

export const selectResourceUriMap = (state) => {
  const resourceKeys = selectResourceKeys(state)
  const resourceUriMap = {}
  resourceKeys.forEach((resourceKey) => {
    const subject = selectNormSubject(state, resourceKey)
    if (subject.uri) resourceUriMap[subject.uri] = resourceKey
  })
  return resourceUriMap
}

export const selectLastSave = (state, resourceKey) =>
  state.editor.lastSave[resourceKey]

export const selectNormValues = (state, valueKeys) => {
  if (!valueKeys) return null
  return valueKeys.map((valueKey) => selectNormValue(state, valueKey))
}

export const selectResourceGroup = (state, resourceKey) =>
  _.pick(selectNormSubject(state, resourceKey), ["group", "editGroups"])

export const selectUri = (state, resourceKey) =>
  state.entities.subjects[resourceKey]?.uri

export const selectResourceId = (state, resourceKey) => {
  const uri = selectUri(state, resourceKey)
  if (!uri) return null

  return uri.substr(`${Config.sinopiaApiBase}/resource/`.length)
}

export const selectSiblingValues = (state, valueKey) => {
  const value = selectNormValue(state, valueKey)
  const property = selectNormProperty(state, value?.propertyKey)
  const valueSubject = selectNormSubject(state, value?.valueSubjectKey)
  const values = selectNormValues(state, property?.valueKeys) || []

  return values.filter((siblingValue) => {
    const siblingValueSubject = selectNormSubject(
      state,
      siblingValue.valueSubjectKey
    )
    return (
      siblingValueSubject.subjectTemplateKey === valueSubject.subjectTemplateKey
    )
  })
}

export const selectResourceLabel = (state, subjectKey) =>
  selectNormSubject(state, subjectKey)?.label

// Only select certain properties from a subject.
// Note that this will return a unique object every time.
export const selectPickSubject = (state, key, props) =>
  _.pick(state.entities.subjects[key], props)

export const selectVersions = (state, resourceKey) =>
  state.entities.versions[resourceKey]

export const selectMainTitleProperty = (state, key) => {
  // Selects main title for a resource like:
  //   <> <http://id.loc.gov/ontologies/bibframe/title> _:b206;
  //   _:b1 a <http://id.loc.gov/ontologies/bibframe/Title>;
  //      <http://id.loc.gov/ontologies/bibframe/mainTitle> "The main title"@en;
  const subject = selectSubject(state, key)
  if (_.isEmpty(subject)) return null

  const titleValues = subject.properties.flatMap((property) => {
    const propertyTemplate = selectPropertyTemplate(
      state,
      property.propertyTemplateKey
    )
    if (
      propertyTemplate?.defaultUri !==
      "http://id.loc.gov/ontologies/bibframe/title"
    )
      return []
    return property.valueKeys.map((valueKey) =>
      selectNormValue(state, valueKey)
    )
  })
  if (_.isEmpty(titleValues)) return null

  const titleValueSubjects = titleValues.map((titleValue) => {
    if (!titleValue.valueSubjectKey) return null
    const titleValueSubject = selectSubject(state, titleValue.valueSubjectKey)
    if (
      titleValueSubject.subjectTemplate.class !==
      "http://id.loc.gov/ontologies/bibframe/Title"
    )
      return null
    return titleValueSubject
  })
  const titleValueSubject = titleValueSubjects.find(
    (titleValueSubject) => titleValueSubject
  )
  if (!titleValueSubject) return null

  return titleValueSubject.properties.find((property) => {
    const propertyTemplate = selectPropertyTemplate(
      state,
      property.propertyTemplateKey
    )
    return (
      propertyTemplate?.defaultUri ===
      "http://id.loc.gov/ontologies/bibframe/mainTitle"
    )
  })
}

export const selectMainTitleValue = (state, key) => {
  const mainTitleProperty = selectMainTitleProperty(state, key)
  if (!mainTitleProperty) return null
  if (_.isEmpty(mainTitleProperty.valueKeys)) return null

  return selectNormValue(state, mainTitleProperty.valueKeys[0])
}
