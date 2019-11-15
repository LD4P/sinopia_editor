// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["warn", 4] */

import { appendError, setResourceTemplate } from 'actions/index'
import { clearTemplateMessages, setTemplateMessages } from 'actions/flash'
import { clearModalMessages, addModalMessage, showModal } from 'actions/modals'
import validateResourceTemplate from 'ResourceTemplateValidator'
import { createResourceTemplate, getResourceTemplate, updateResourceTemplate } from 'sinopiaServer'
import { findResourceTemplate } from 'selectors/entitySelectors'
import { getCurrentUser } from 'authSelectors'
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

// Resource templates are set via ImportFileZone
export const setResourceTemplates = (content, group) => async (dispatch, getState) => {
  dispatch(clearTemplateMessages())
  dispatch(clearModalMessages())
  const user = getCurrentUser(getState())
  const responses = []

  // if we have a profile with multiple resource templates, iterate and load all of them
  if (content.Profile) {
    // Prefer for ... of to forEach when loop body uses async/await
    for (const rt of content.Profile.resourceTemplates) {
      const response = await createResource(rt, group, user, dispatch)
      responses.push(response)
    }
  }
  else // if the uploaded content is a single resource template, just load that one
  {
    const response = await createResource(content, group, user, dispatch)
    responses.push(response)
  }
  updateStateFromServerResponses(responses, dispatch)
}

const createResource = async (content, group, user, dispatch) => {
  try {
    const response = await createResourceTemplate(content, group, user)

    return response.response
  } catch (error) {
    dispatch(addModalMessage(error.response))

    return error.response
  }
}

const updateStateFromServerResponses = (responses, dispatch) => {
  const newFlashMessages = []
  let showModalBit = false

  responses.forEach((response) => {
    // If any responses are HTTP 409s, flip `showModal` to true, which then renders the overwrite confirmation prompt
    showModalBit = showModalBit || response.status === 409
    if (!showModalBit) { // only show flash error messages if we are *not* showing the modal confirmation
      newFlashMessages.push(`${humanReadableStatus(response.status)} ${humanReadableLocation(response)}`)
    }
  })

  if (newFlashMessages.length > 0) {
    dispatch(setTemplateMessages(newFlashMessages))
  }

  if (showModalBit) dispatch(showModal('UpdateResourceModal'))
}

// Returns a URL or an empty string
const humanReadableLocation = (response) => {
  if (response?.headers?.location) return response.headers.location

  if (response?.req?._data?.id) {
    // If RT has special characters—e.g., colons—in it, decode the URI to compare against ID
    const decodedURI = decodeURIComponent(response.req.url)
    // If the request URL already contains the ID, don't bother appending

    if (decodedURI.endsWith(response.req._data.id)) return decodedURI

    return `${decodedURI}/${response.req._data.id}`
  }

  // Welp, we tried anyway
  return ''
}

const humanReadableStatus = (status) => {
  switch (status) {
    case 201:
      return 'Created'
    case 204:
      return 'Updated'
    case 401:
      return 'You are not authorized to do this. Try logging in again!'
    case 409:
      return '' // 409 errors are an overwrite operation, which spawn a modal but no flash messages
    default:
      return `Unexpected response (${status})!`
  }
}

export const handleUpdateResource = (rts, group) => async (dispatch, getState) => {
  const user = getCurrentUser(getState())
  const responses = await Promise.all(rts.map(rt => updateResource(rt, group, user, dispatch)))

  updateStateFromServerResponses(responses, dispatch)
}

// Update the content in Trellis and update our local cache.
const updateResource = async (content, group, user, dispatch) => {
  try {
    const response = await updateResourceTemplate(content, group, user)
    dispatch(setResourceTemplate(content)) // This updates the cache
    return response.response
  } catch (error) {
    return error.response
  }
}
