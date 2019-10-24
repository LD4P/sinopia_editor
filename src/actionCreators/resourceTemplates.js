// Copyright 2019 Stanford University see LICENSE for license
import {
  appendError, setResourceTemplate, setResourceTemplateSummary,
  clearErrors,
} from 'actions/index'
import { loadedResourceTemplateSummaries } from 'actions/entities'
import validateResourceTemplate from 'ResourceTemplateValidator'
import Config from 'Config'
import { getResourceTemplate, listResourcesInGroupContainer } from 'sinopiaServer'
import { resourceToName } from 'Utilities'
import { findResourceTemplate } from 'selectors/entitySelectors'
import _ from 'lodash'

// A thunk that gets a resource template from state or the server.
export const fetchResourceTemplate = (resourceTemplateId, errorKey) => (dispatch, getState) => {
  // Try to get it from state.
  const resourceTemplate = findResourceTemplate(getState(), resourceTemplateId)
  if (resourceTemplate) return resourceTemplate

  return getResourceTemplate(resourceTemplateId, 'ld4p').then((response) => {
    // If resource template loads, then validate.
    const resourceTemplate = response.response.body
    return validateResourceTemplate(resourceTemplate).then((errors) => {
      if (_.isEmpty(errors)) {
        dispatch(setResourceTemplate(resourceTemplate))
        return resourceTemplate
      }
      errors.forEach(error => dispatch(appendError(errorKey, error)))
    }).catch((err) => { throw err })
  }).catch((err) => {
    console.error(err)
    dispatch(appendError(errorKey, `Error retrieving ${resourceTemplateId}: ${err.toString()}`))
    return null
  })
}

export const fetchResourceTemplateSummaries = errorKey => (dispatch) => {
  dispatch(clearErrors(errorKey))

  const groupName = Config.defaultSinopiaGroupId
  return listResourcesInGroupContainer(groupName).then((resourceTemplatesResponse) => {
    // Short-circuit listing resources in a group if it contains nothing
    if (resourceTemplatesResponse.response.body.contains) {
      const templateIds = [].concat(resourceTemplatesResponse.response.body.contains)
      return Promise.all(templateIds.map(templateId => dispatch(fetchResourceTemplateSummary(templateId, groupName, errorKey))))
    } })
    .then(() => dispatch(loadedResourceTemplateSummaries()))
    .catch((err) => {
      console.error(err)
      dispatch(appendError(errorKey, `Error retrieving list of resource templates: ${err.toString()}`))
    })
}

export const fetchResourceTemplateSummary = (templateId, groupName, errorKey) => (dispatch) => {
  const templateName = resourceToName(templateId)
  return getResourceTemplate(templateName, groupName).then((templateResponse) => {
    const template = templateResponse.response.body
    const templateSummary = {
      key: template.id,
      name: template.resourceLabel,
      id: template.id,
      group: groupName,
      author: template.author,
      remark: template.remark,
    }
    dispatch(setResourceTemplateSummary(templateSummary))
  }, (err) => {
    console.error(err)
    dispatch(appendError(errorKey, `Error retrieving ${templateId}: ${err.toString()}`))
  })
}
