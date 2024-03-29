// Copyright 2020 Stanford University see LICENSE for license

import rdf from "rdf-ext"
import { nanoid } from "nanoid"
import _ from "lodash"
import { loadResourceTemplate } from "actionCreators/templates"
import { addSubject as addSubjectAction, setUnusedRDF } from "actions/resources"
import { selectProperty, selectSubject, selectValue } from "selectors/resources"
import {
  newLiteralValue,
  newUriValue,
  newValueSubject,
} from "utilities/valueFactory"
import { clearErrors, addError } from "actions/errors"
import { fetchResource } from "sinopiaApi"
import { findRootResourceTemplateId } from "utilities/Utilities"

/**
 * Helper methods that should only be used in 'actionCreators/resources'
 */

/**
 * A thunk that loads an existing resource from Sinopia API and adds to state.
 * @return {[resource, unusedDataset]} if successful
 */
export const loadResource =
  (uri, errorKey, { asNewResource = false, version = null } = {}) =>
  (dispatch) => {
    dispatch(clearErrors(errorKey))
    return fetchResource(uri, { version })
      .then(([dataset, response]) => {
        if (!dataset) return false
        const resourceTemplateId = resourceTemplateIdFromDataset(uri, dataset)
        return dispatch(
          addResourceFromDataset(
            dataset,
            uri,
            resourceTemplateId,
            errorKey,
            asNewResource,
            _.pick(response, ["group", "editGroups"])
          )
        )
          .then(([resource, usedDataset]) => {
            const unusedDataset = dataset.difference(usedDataset)
            dispatch(
              setUnusedRDF(
                resource.key,
                unusedDataset.size > 0 ? unusedDataset.toCanonical() : null
              )
            )
            return [response, resource, unusedDataset]
          })
          .catch((err) => {
            // ResourceTemplateErrors have already been dispatched.
            if (err.name !== "ResourceTemplateError") {
              console.error(err)
              dispatch(
                addError(
                  errorKey,
                  `Error retrieving ${uri}: ${err.message || err}`
                )
              )
            }
            return false
          })
      })
      .catch((err) => {
        console.error(err)
        dispatch(
          addError(errorKey, `Error retrieving ${uri}: ${err.message || err}`)
        )
        return false
      })
  }

export const addResourceFromDataset =
  (
    dataset,
    uri,
    resourceTemplateId,
    errorKey,
    asNewResource,
    otherResourceAttrs = {}
  ) =>
  (dispatch) => {
    const subjectTerm = rdf.namedNode(chooseURI(dataset, uri))
    const newUri = asNewResource ? null : uri
    const context = {
      usedDataset: rdf.dataset(),
      dataset,
      errorKey,
      resourceTemplatePromises: {},
    }
    context.usedDataset.addAll(
      context.dataset.match(
        subjectTerm,
        rdf.namedNode("http://sinopia.io/vocabulary/hasResourceTemplate")
      )
    )
    return dispatch(
      recursiveResourceFromDataset(
        subjectTerm,
        newUri,
        resourceTemplateId,
        false,
        context
      )
    ).then((resource) => {
      // Do not copy group or editGroups (passed in via otherResourceAttrs) if resource is new (i.e., copied)
      const newResource = _.merge(resource, otherResourceAttrs)
      if (asNewResource) {
        newResource.group = null
        newResource.editGroups = []
      }

      dispatch(addSubjectAction(newResource))
      return [newResource, context.usedDataset]
    })
  }

// The provided URI or <>.
export const chooseURI = (dataset, uri) =>
  dataset.match(rdf.namedNode(uri)).size > 0 ? uri : ""

export const addEmptyResource = (resourceTemplateId, errorKey) => (dispatch) =>
  dispatch(newSubject(null, resourceTemplateId, {}, errorKey)).then((subject) =>
    dispatch(newPropertiesFromTemplates(subject, false, errorKey)).then(
      (properties) => {
        const promises = properties.map((property) =>
          dispatch(expandProperty(property, errorKey))
        )
        return Promise.all(promises)
          .then((expandedProperties) => {
            subject.properties = expandedProperties
            return dispatch(addSubjectAction(subject))
          })
          .then(() => subject)
      }
    )
  )

const expandProperty = (property, errorKey) => (dispatch) => {
  if (property.propertyTemplate.type === "resource") {
    property.values = []
    const promises = property.propertyTemplate.valueSubjectTemplateKeys.map(
      (resourceTemplateId) =>
        dispatch(newSubject(null, resourceTemplateId, {}, errorKey)).then(
          (subject) =>
            dispatch(newPropertiesFromTemplates(subject, false, errorKey)).then(
              (properties) => {
                subject.properties = properties
                const newValue = newValueSubject(
                  property,
                  property.propertyTemplate.defaultUri,
                  subject
                )
                property.values.push(newValue)
                property.show = true
              }
            )
        )
    )
    return Promise.all(promises).then(() => property)
  }
  property.values = defaultValuesFor(property)
  property.show = true
  return property
}

export const recursiveResourceFromDataset =
  (subjectTerm, uri, resourceTemplateId, suppress, context) => (dispatch) =>
    dispatch(
      newSubjectFromDataset(subjectTerm, uri, resourceTemplateId, context)
    ).then((subject) =>
      dispatch(
        newPropertiesFromTemplates(subject, true, context.errorKey)
      ).then((properties) =>
        Promise.all(
          properties.map((property) =>
            dispatch(
              newValuesFromDatasetByProperty(
                subjectTerm,
                property,
                suppress,
                context
              )
            ).then((values) => {
              const compactValues = _.compact(_.flatten(values))
              if (!_.isEmpty(compactValues)) {
                property.values = compactValues
                // If ordered, set property uri
                if (property.propertyTemplate.ordered)
                  property.propertyUri = _.first(compactValues).propertyUri
              }

              return compactValues
            })
          )
        ).then(() => {
          subject.properties = properties
          return subject
        })
      )
    )

const newSubjectFromDataset =
  (subjectTerm, uri, resourceTemplateId, context) => (dispatch) =>
    dispatch(
      newSubject(
        uri,
        resourceTemplateId,
        context.resourceTemplatePromises,
        context.errorKey
      )
    ).then((subject) => {
      // Add classes
      const typeQuads = context.dataset
        .match(
          subjectTerm,
          rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type")
        )
        .toArray()
      context.usedDataset.addAll(typeQuads)
      subject.classes = typeQuads.map((quad) => quad.object.value)
      return subject
    })

export const newSubject =
  (uri, resourceTemplateId, resourceTemplatePromises, errorKey) =>
  (dispatch) => {
    const key = nanoid()
    return dispatch(
      loadResourceTemplate(
        resourceTemplateId,
        resourceTemplatePromises,
        errorKey
      )
    ).then((subjectTemplate) => {
      // This handles if there was an error fetching resource template
      if (!subjectTemplate) {
        const err = new Error(`Unable to load ${resourceTemplateId}`)
        err.name = "ResourceTemplateError"
        console.error(err.toString())
        throw err
      }

      return {
        key,
        uri: _.isEmpty(uri) ? null : uri,
        subjectTemplate,
        properties: [],
      }
    })
  }

export const newPropertiesFromTemplates =
  (subject, noDefaults, errorKey) => (dispatch) =>
    Promise.all(
      subject.subjectTemplate.propertyTemplates.map((propertyTemplate) =>
        dispatch(newProperty(subject, propertyTemplate, noDefaults, errorKey))
      )
    )

const newValuesFromDatasetByProperty =
  (subjectTerm, property, suppress, context) => (dispatch) =>
    Promise.all(
      Object.keys(property.propertyTemplate.uris).flatMap((propertyUri) =>
        dispatch(
          newValuesFromDatasetByPropertyUri(
            subjectTerm,
            property,
            propertyUri,
            suppress,
            context
          )
        )
      )
    )

const newValuesFromDatasetByPropertyUri =
  (subjectTerm, property, propertyUri, suppress, context) => (dispatch) => {
    // Get the objects for the values. How depends on whether property is ordered or suppressed.
    let objects = null
    if (suppress) {
      objects = [subjectTerm]
    } else if (property.propertyTemplate.ordered) {
      objects = orderedObjects(subjectTerm, propertyUri, context)
    } else {
      objects = unorderedObjects(subjectTerm, propertyUri, context)
    }

    if (property.propertyTemplate.type === "resource") {
      // Get the values based on the template and the dataset then merge.
      const objPromises = _.compact(
        objects.map((obj) =>
          dispatch(
            newNestedResourceFromObject(obj, property, propertyUri, context)
          )
        )
      )
      return Promise.all(objPromises).then((valuesFromObjs) => {
        if (_.isEmpty(valuesFromObjs)) return []
        const templatePromises = templatePromisesFor(
          property,
          context.errorKey,
          dispatch
        )
        return Promise.all(templatePromises).then((valuesFromTemplates) =>
          mergeValues(valuesFromTemplates, valuesFromObjs)
        )
      })
    }
    return Promise.all(
      objects.map((obj) => {
        if (obj.termType === "NamedNode") {
          // URI
          return Promise.resolve(
            newUriFromObject(obj, property, propertyUri, context)
          )
        }
        // Literal
        return Promise.resolve(newLiteralFromObject(obj, property, propertyUri))
      })
    )
  }

// Promises that return values based on template
const templatePromisesFor = (property, errorKey, dispatch) =>
  property.propertyTemplate.valueSubjectTemplateKeys.map((resourceTemplateId) =>
    dispatch(newSubject(null, resourceTemplateId, {}, errorKey)).then(
      (subject) =>
        dispatch(newPropertiesFromTemplates(subject, false, errorKey)).then(
          (properties) => {
            subject.properties = properties
            return newValueSubject(
              property,
              property.propertyTemplate.defaultUri,
              subject
            )
          }
        )
    )
  )

// Merge the values from the dataset and templates
const mergeValues = (valuesFromTemplates, valuesFromObjs) => {
  const valuesFromObjsMap = valuesMapFor(valuesFromObjs)
  const newValues = []
  valuesFromTemplates.forEach((valueFromTemplate) => {
    // Use values from dataset.
    // Otherwise, use values from template.
    const key = valuesMapKeyFor(valueFromTemplate)
    if (valuesFromObjsMap[key]) {
      valuesFromObjsMap[key].forEach((valueFromObj) =>
        newValues.push(valueFromObj)
      )
    } else {
      newValues.push(valueFromTemplate)
    }
  })
  return newValues
}

// Construct map of subject template key and property uri to value
const valuesMapFor = (values) => {
  const valuesMap = {}
  values.forEach((value) => {
    if (_.isEmpty(value)) return
    const key = valuesMapKeyFor(value)
    if (!valuesMap[key]) valuesMap[key] = []
    valuesMap[key].push(value)
  })
  return valuesMap
}

const valuesMapKeyFor = (value) =>
  [
    value.valueSubject.subjectTemplate.key,
    value.propertyKey || value.property.key,
  ].join("-")

const orderedObjects = (subjectTerm, propertyUri, context) => {
  // All quads for this property uri
  const quads = context.dataset
    .match(subjectTerm, rdf.namedNode(propertyUri))
    .toArray()
  // Should only be one.
  if (quads.length > 1) {
    console.error(`More than one quad for ordered property ${propertyUri}.`)
    return []
  }
  if (quads.length === 0) return []
  context.usedDataset.addAll(quads)
  const objects = []
  recursiveOrderedObjects(quads[0].object, objects, context)
  return objects
}

const recursiveOrderedObjects = (subjectTerm, objects, context) => {
  const firstQuad = context.dataset
    .match(
      subjectTerm,
      rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#first")
    )
    .toArray()[0]
  if (!firstQuad) return
  context.usedDataset.add(firstQuad)
  objects.push(firstQuad.object)
  const restQuad = context.dataset
    .match(
      subjectTerm,
      rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#rest")
    )
    .toArray()[0]
  context.usedDataset.add(restQuad)
  if (
    restQuad.object.value !== "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil"
  )
    recursiveOrderedObjects(restQuad.object, objects, context)
}

const unorderedObjects = (subjectTerm, propertyUri, context) => {
  // All quads for this property uri
  const quads = context.dataset
    .match(subjectTerm, rdf.namedNode(propertyUri))
    .toArray()
  context.usedDataset.addAll(quads)
  return quads.map((quad) => quad.object)
}

const newNestedResourceFromObject =
  (obj, property, propertyUri, context) => (dispatch) => {
    // Only build this embedded resource if can find the resource template.
    // Multiple types may be provided.
    const typeQuads = context.dataset
      .match(
        obj,
        rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type")
      )
      .toArray()

    // Among the valueTemplateRefs, find all of the resource templates that match a type.
    // Ideally, only want 1 but need to handle other cases.
    return Promise.all(
      typeQuads.map((typeQuad) =>
        dispatch(
          selectResourceTemplateId(
            property.propertyTemplate,
            typeQuad.object.value,
            context
          )
        )
      )
    ).then((childRtIds) => {
      const compactChildRtIds = _.compact(_.flatten(childRtIds))

      // Don't know which to pick, so error.
      if (compactChildRtIds.length > 1) {
        throw `More than one resource template matches: ${compactChildRtIds}`
      }
      // No matching resource template, so do nothing
      if (_.isEmpty(compactChildRtIds)) {
        return null
      }
      context.usedDataset.addAll(typeQuads)

      // One resource template
      const suppress = obj.termType === "NamedNode"
      return dispatch(
        recursiveResourceFromDataset(
          obj,
          null,
          compactChildRtIds[0],
          suppress,
          context
        )
      ).then((subject) => newValueSubject(property, propertyUri, subject))
    })
  }

const selectResourceTemplateId =
  (propertyTemplate, resourceURI, { resourceTemplatePromises, errorKey }) =>
  (dispatch) =>
    Promise.all(
      // The keys are resource template ids. They may or may not be in state
      propertyTemplate.valueSubjectTemplateKeys.map((resourceTemplateId) =>
        dispatch(
          loadResourceTemplate(
            resourceTemplateId,
            resourceTemplatePromises,
            errorKey
          )
        ).then((subjectTemplate) =>
          subjectTemplate.class === resourceURI ? resourceTemplateId : undefined
        )
      )
    )

const newLiteralFromObject = (obj, property, propertyUri) =>
  newLiteralValue(property, propertyUri, obj.value, obj.language)

const newUriFromObject = (obj, property, propertyUri, context) => {
  const uri = obj.value
  const labelQuads = context.dataset
    .match(obj, rdf.namedNode("http://www.w3.org/2000/01/rdf-schema#label"))
    .toArray()
  let label = property.propertyTemplate.labelSuppressed ? null : uri
  let lang = null
  if (labelQuads.length > 0) {
    // First that doesn't start with http or first
    const labelQuad =
      labelQuads.find(
        (labelQuad) => !labelQuad.object.value.startsWith("http")
      ) || labelQuads[0]
    label = labelQuad.object.value
    lang = labelQuad.object.language || null
    // Adding all to usedData, even though only using first. This is to avoid user confusion over extra triples, e.g., https://github.com/LD4P/sinopia_editor/issues/2634
    context.usedDataset.addAll(labelQuads)
  }
  return newUriValue(property, propertyUri, uri, label, lang)
}

const newProperty =
  (subject, propertyTemplate, noDefaults, errorKey) => (dispatch) => {
    const key = nanoid()
    const property = {
      key,
      subject,
      propertyTemplate,
      values: null,
      show: false,
      propertyUri: null,
    }
    if (!noDefaults && !_.isEmpty(property.propertyTemplate.defaults)) {
      property.values = defaultValuesFor(property)
      if (!_.isEmpty(property.values)) property.show = true
    }

    // If ordered, then set property uri
    if (propertyTemplate.ordered)
      property.propertyUri = propertyTemplate.defaultUri

    // If required and we do not already have some default values, then expand the property.
    if (propertyTemplate.required && !property.values) {
      property.show = true
      return dispatch(
        valuesForExpandedProperty(property, noDefaults, errorKey)
      ).then((values) => {
        property.values = values
        return property
      })
    }

    return property
  }

export function defaultValuesFor(property) {
  return property.propertyTemplate.defaults.map((defaultValue) => {
    if (property.propertyTemplate.type === "uri") {
      return newUriValue(
        property,
        property.propertyTemplate.defaultUri,
        defaultValue.uri,
        defaultValue.label,
        defaultValue.lang
      )
    }
    return newLiteralValue(
      property,
      property.propertyTemplate.defaultUri,
      defaultValue.literal,
      defaultValue.lang
    )
  })
}

const valuesForExpandedProperty =
  (property, noDefaults, errorKey) => (dispatch) => {
    if (property.propertyTemplate.type === "resource") {
      return Promise.all(
        property.propertyTemplate.valueSubjectTemplateKeys.map(
          (resourceTemplateId) =>
            dispatch(newSubject(null, resourceTemplateId, {}, errorKey)).then(
              (subject) =>
                dispatch(
                  newPropertiesFromTemplates(subject, noDefaults, errorKey)
                ).then((properties) => {
                  subject.properties = properties
                  return newValueSubject(
                    property,
                    property.propertyTemplate.defaultUri,
                    subject
                  )
                })
            )
        )
      )
    }
    return Promise.resolve([])
  }

export const newSubjectCopy = (subjectKey, value) => (dispatch, getState) => {
  const subject = selectSubject(getState(), subjectKey)
  const newSubject = _.pick(subject, ["subjectTemplate", "classes"])

  // Add to value
  if (value) value.valueSubject = newSubject

  newSubject.key = nanoid()
  newSubject.uri = null
  newSubject.properties = []

  // Add properties
  return Promise.all(
    subject.properties.map((property) =>
      dispatch(newPropertyCopy(property.key, newSubject))
    )
  ).then(() => newSubject)
}

const newPropertyCopy = (propertyKey, subject) => (dispatch, getState) => {
  const property = selectProperty(getState(), propertyKey)
  const newProperty = _.pick(property, [
    "propertyTemplate",
    "propertyUri",
    "show",
  ])

  // Add to subject
  subject.properties.push(newProperty)

  newProperty.key = nanoid()
  newProperty.subject = subject
  newProperty.values = property.valueKeys === null ? null : []

  // Add values
  if (property.values) {
    return Promise.all(
      property.values.map((value) =>
        dispatch(newValueCopy(value.key, newProperty))
      )
    ).then(() => newProperty)
  }
  return newProperty
}

const newValueCopy = (valueKey, property) => (dispatch, getState) => {
  const value = selectValue(getState(), valueKey)
  const newValue = _.pick(value, [
    "literal",
    "lang",
    "uri",
    "label",
    "propertyUri",
    "component",
  ])

  // Add to property
  property.values.push(newValue)

  newValue.key = nanoid()
  newValue.propertyKey = property.key
  newValue.valueSubject = null

  if (value.valueSubject) {
    return dispatch(newSubjectCopy(value.valueSubject.key, newValue)).then(
      () => newValue
    )
  }

  return newValue
}

export const resourceTemplateIdFromDataset = (uri, dataset) => {
  const resourceTemplateId = findRootResourceTemplateId(uri, dataset)
  if (!resourceTemplateId)
    throw new Error(
      "A single resource template must be included as a triple (http://sinopia.io/vocabulary/hasResourceTemplate)"
    )
  return resourceTemplateId
}
