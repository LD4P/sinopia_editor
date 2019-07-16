// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 6] */

import {
  retrieveResourceTemplateStarted,
  retrieveError, setResourceTemplate,
} from 'actions/index'
import { getResourceTemplate } from 'sinopiaServer'
import validateResourceTemplate from 'ResourceTemplateValidator'
import _ from 'lodash'

const fetchResourceTemplate = (resourceTemplateId, dispatch) => {
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

export { fetchResourceTemplate as default }
