// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 7] */

import {
  assignBaseURL, updateStarted, updateFinished,
  retrieveResourceStarted, setResource, updateProperty,
  toggleCollapse, appendResource, clearResourceTemplates,
  clearResourceURIMessage,
} from 'actions/index'
import { fetchResourceTemplate } from 'actionCreators/resourceTemplates'
import { updateRDFResource, loadRDFResource } from 'sinopiaServer'
import { rootResourceId, findNode } from 'selectors/resourceSelectors'
import { findResourceTemplate } from 'selectors/entitySelectors'
import GraphBuilder from 'GraphBuilder'
import { isResourceWithValueTemplateRef, rdfDatasetFromN3, defaultValuesFromPropertyTemplate } from 'Utilities'
import shortid from 'shortid'
import ResourceStateBuilder from 'ResourceStateBuilder'
import _ from 'lodash'

// A thunk that updates an existing resource in Trellis
export const update = currentUser => (dispatch, getState) => {
  dispatch(updateStarted())

  const uri = rootResourceId(getState())
  const rdf = new GraphBuilder(getState().selectorReducer).graph.toString()
  return updateRDFResource(currentUser, uri, rdf)
    .then(response => dispatch(updateFinished(response)))
}

// A thunk that loads an existing resource from Trellis
export const retrieveResource = (currentUser, uri) => (dispatch) => {
  // First dispatch: inform the app that loading has started
  dispatch(retrieveResourceStarted())

  return loadRDFResource(currentUser, uri)
    .then((response) => {
      dispatch(clearResourceTemplates())
      const data = response.response.text
      return rdfDatasetFromN3(data).then((dataset) => {
        const builder = new ResourceStateBuilder(dataset, null)
        dispatch(existingResource(builder.state, uri))
      })
    })
}

// A thunk that stubs out a new resource
export const newResource = resourceTemplateId => (dispatch) => {
  const resource = {}
  resource[resourceTemplateId] = {}
  dispatch(clearResourceTemplates())
  dispatch(clearResourceURIMessage())
  dispatch(setResource(resource))
  dispatch(stubResource(true))
}

// A thunk that stubs out an existing new resource
export const existingResource = (resource, uri) => (dispatch) => {
  dispatch(clearResourceURIMessage())
  dispatch(setResource(resource))
  dispatch(assignBaseURL(uri))
  dispatch(stubResource(false))
}

// A thunk that expands a nested resource for a property
export const expandResource = reduxPath => (dispatch, getState) => {
  const state = getState()
  const nestedResource = findNode(state.selectorReducer, reduxPath)
  const resourceTemplateId = reduxPath.slice(-2)[0]
  const propertyURI = reduxPath.slice(-1)[0]
  const resourceTemplate = findResourceTemplate(state.selectorReducer, resourceTemplateId)
  stubProperty(resourceTemplateId, resourceTemplate, nestedResource, propertyURI, dispatch).then((resourceProperties) => {
    dispatch(updateProperty(reduxPath, resourceProperties))
  })
}

// A thunk that adds a resource as sibling of provided reduxPath
export const addResource = reduxPath => (dispatch, getState) => {
  const state = getState()
  const resourceTemplateId = reduxPath.slice(-1)[0]
  const resourceTemplate = findResourceTemplate(state.selectorReducer, resourceTemplateId)
  const key = shortid.generate()
  const addedResource = { [key]: { [resourceTemplateId]: {} } }
  const parentReduxPath = reduxPath.slice(0, reduxPath.length - 2)
  const newReduxPath = [...parentReduxPath, key, resourceTemplateId]

  stubResourceProperties(resourceTemplateId, resourceTemplate, addedResource, newReduxPath, false, false, dispatch).then((resourceProperties) => {
    dispatch(appendResource(newReduxPath, resourceProperties))
  })
}

// Stubs out a root resource
const stubResource = useDefaults => (dispatch, getState) => {
  const state = getState()
  const newResource = { ...state.selectorReducer.resource }
  const rootResourceTemplateId = Object.keys(newResource)[0]
  const rootResource = newResource[rootResourceTemplateId]
  const resourceTemplate = findResourceTemplate(state.selectorReducer, rootResourceTemplateId)
  stubResourceProperties(rootResourceTemplateId, resourceTemplate, rootResource, ['resource'], useDefaults, false, dispatch).then((resourceProperties) => {
    newResource[rootResourceTemplateId] = resourceProperties
    dispatch(setResource(newResource))
  })
}

// For a single property of a resource, stub it out.
export const stubProperty = async (resourceTemplateId, existingResourceTemplate, resource, propertyURI, dispatch) => {
  const newResource = { ...resource }
  const resourceTemplate = existingResourceTemplate || await fetchResourceTemplate(resourceTemplateId, dispatch)
  // This handles if there was an error fetching resource template
  if (!resourceTemplate) {
    return newResource
  }

  const propertyTemplate = resourceTemplate.propertyTemplates.find(propertyTemplate => propertyTemplate.propertyURI === propertyURI)
  if (isResourceWithValueTemplateRef(propertyTemplate)) {
    propertyTemplate.valueConstraint.valueTemplateRefs.forEach((resourceTemplateId) => {
      fetchResourceTemplate(resourceTemplateId, dispatch)
      // See if there is already a <key> > <resource template id> for this resource template id
      const nestedResource = Object.keys(newResource).find(key => _.first(Object.keys(newResource[key])) === resourceTemplateId)
      if (nestedResource === undefined) {
        newResource[shortid.generate()] = { [resourceTemplateId]: {} }
      }
    })
  } else if (newResource.items === undefined) {
    // Defaults
    const defaults = defaultValuesFromPropertyTemplate(propertyTemplate)
    newResource.items = _.isEmpty(defaults) ? [] : defaults
  }
  return newResource
}

// For a resource, stub out of its properties.
// Private, but exporting for testing.
export const stubResourceProperties = async (resourceTemplateId, existingResourceTemplate, resource, reduxPath, useDefaults, stubMandatoryOnly, dispatch) => {
  const newResource = _.cloneDeep(resource)
  const newResourceReduxPath = [...reduxPath, resourceTemplateId]
  const resourceTemplate = existingResourceTemplate || await fetchResourceTemplate(resourceTemplateId, dispatch)
  // This handles if there was an error fetching resource template
  if (!resourceTemplate) {
    return newResource
  }
  // Given the resource template for this resource
  // For each property template
  await Promise.all(
    resourceTemplate.propertyTemplates.map(async (propertyTemplate) => {
      const propertyURI = propertyTemplate.propertyURI
      const newResourcePropertyReduxPath = [...newResourceReduxPath, propertyURI]
      const isMandatory = propertyTemplate.mandatory === 'true'

      // Toggle if there is a value.
      if (newResource[propertyURI] !== undefined) {
        dispatch(toggleCollapse(newResourcePropertyReduxPath))
      }

      // If it is a value ref
      if (isResourceWithValueTemplateRef(propertyTemplate)) {
        if (stubMandatoryOnly && !isMandatory) {
          return
        }

        if (newResource[propertyTemplate.propertyURI] === undefined) {
          newResource[propertyTemplate.propertyURI] = {}
        }
        // For each value template
        // Since these are promises, using Promise.all for https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
        await Promise.all(
          propertyTemplate.valueConstraint.valueTemplateRefs.map(async (resourceTemplateId) => {
            const nestedResourceTemplatePromise = fetchResourceTemplate(resourceTemplateId, dispatch)
            // See if there is alread a <key> > <resource template id> for this resource template id
            const existingNestedResourceKey = Object.keys(newResource[propertyTemplate.propertyURI]).find(
              key => _.first(Object.keys(newResource[propertyTemplate.propertyURI][key])) === resourceTemplateId,
            )

            const newResourceKey = shortid.generate()
            if (existingNestedResourceKey === undefined) {
              newResource[propertyTemplate.propertyURI][newResourceKey] = { [resourceTemplateId]: {} }
              if (!isMandatory) {
                return
              }
            }
            const nestedResourceKey = existingNestedResourceKey || newResourceKey
            const newResourcePropertyValueReduxPath = [...newResourcePropertyReduxPath, nestedResourceKey]
            const nestedResource = newResource[propertyTemplate.propertyURI][nestedResourceKey][resourceTemplateId]
            const nestedResourceTemplate = await nestedResourceTemplatePromise
            const newNestedResource = await stubResourceProperties(resourceTemplateId, nestedResourceTemplate,
              nestedResource, newResourcePropertyValueReduxPath, useDefaults, isMandatory, dispatch)
            newResource[propertyTemplate.propertyURI][nestedResourceKey][resourceTemplateId] = newNestedResource
          }),
        )
        // If it is a property ref
      } else if (newResource[propertyTemplate.propertyURI] === undefined) {
        newResource[propertyTemplate.propertyURI] = {}
        // Defaults
        const defaults = defaultValuesFromPropertyTemplate(propertyTemplate)
        if (useDefaults && !_.isEmpty(defaults)) {
          newResource[propertyTemplate.propertyURI].items = defaults
          dispatch(toggleCollapse(newResourcePropertyReduxPath))
        }
      }
    }),
  )
  return newResource
}
