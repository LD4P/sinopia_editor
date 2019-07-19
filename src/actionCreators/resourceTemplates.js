// Copyright 2019 Stanford University see LICENSE for license
import {
  retrieveResourceTemplateStarted,
  retrieveError, setResourceTemplate, setResourceTemplateSummary,
} from 'actions/index'
import validateResourceTemplate from 'ResourceTemplateValidator'
import Config from 'Config'
import { getResourceTemplate, listResourcesInGroupContainer } from 'sinopiaServer'
import { resourceToName } from 'Utilities'
import _ from 'lodash'

export const fetchResourceTemplate = (resourceTemplateId, dispatch) => {
  dispatch(retrieveResourceTemplateStarted(resourceTemplateId))

  return getResourceTemplate(resourceTemplateId, 'ld4p').then((response) => {
    // If resource template loads, then validate.
    const resourceTemplate = response.response.body
    const reason = validateResourceTemplate(resourceTemplate)
    if (_.isEmpty(reason)) {
      dispatch(setResourceTemplate(resourceTemplate))
      return resourceTemplate
    }
    dispatch(retrieveError(resourceTemplateId, reason))
  }).catch((err) => {
    console.error(err)
    dispatch(retrieveError(resourceTemplateId))
  })
}

export const fetchResourceTemplateSummaries = () => (dispatch) => {
  const groupName = Config.defaultSinopiaGroupId
  return listResourcesInGroupContainer(groupName).then((resourceTemplatesResponse) => {
    // Short-circuit listing resources in a group if it contains nothing
    if (resourceTemplatesResponse.response.body.contains) {
      const templateIds = [].concat(resourceTemplatesResponse.response.body.contains)
      return Promise.all(templateIds.map(templateId => fetchResourceTemplateSummary(templateId, groupName, dispatch)))
    }
  }, (error) => {
    console.error('Error retrieving list of resource templates', error)
  })
}

export const fetchResourceTemplateSummary = (templateId, groupName, dispatch) => {
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
  }, (error) => {
    console.error(`Error retrieving resource template ${templateId}`, error)
  })
}
