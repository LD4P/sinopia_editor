// Copyright 2019 Stanford University see LICENSE for license
import { appendError, setResourceTemplate } from 'actions/index'
import validateResourceTemplate from 'ResourceTemplateValidator'
import { getResourceTemplate } from 'sinopiaServer'
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

// To avoid have to export fetchResourceTemplate as default
export const noop = () => {}
