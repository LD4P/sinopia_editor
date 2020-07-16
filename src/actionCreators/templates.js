// Copyright 2019 Stanford University see LICENSE for license
import { addError } from 'actions/errors'
import { clearTemplateMessages, setTemplateMessages } from 'actions/messages'
import { clearModalMessages, addModalMessage, showModal } from 'actions/modals'
import { createResourceTemplate, updateResourceTemplate } from 'sinopiaServer'
import { selectCurrentUser } from 'selectors/authenticate'
import { loadResourceTemplateWithoutValidation } from './templateHelpers'
import { validateTemplates } from './templateValidationHelpers'

/**
 * A thunk that gets a resource template from state or the server.
 * @return [Object] subject template
 */
export const loadResourceTemplate = (resourceTemplateId, errorKey) => (dispatch) => dispatch(loadResourceTemplateWithoutValidation(resourceTemplateId))
  .then((subjectTemplate) => dispatch(validateTemplates(subjectTemplate, errorKey))
    .then((isValid) => (isValid ? subjectTemplate : null))).catch((err) => {
    dispatch(addError(errorKey, `Error retrieving ${resourceTemplateId}: ${err.toString()}`))
    return null
  })

// Resource templates are set via ImportFileZone
export const saveNewProfileOrResourceTemplate = (content, group) => (dispatch, getState) => {
  dispatch(clearTemplateMessages())
  dispatch(clearModalMessages())
  const user = selectCurrentUser(getState())

  const responsePromises = []
  // if we have a profile with multiple resource templates, iterate and load all of them
  if (content.Profile) {
    // Prefer for ... of to forEach when loop body uses async/await
    for (const rt of content.Profile.resourceTemplates) {
      responsePromises.push(saveNewResourceTemplate(rt, group, user, dispatch))
    }
  }
  else {
    // if the uploaded content is a single resource template, just load that one
    responsePromises.push(saveNewResourceTemplate(content, group, user, dispatch))
  }
  return Promise.all(responsePromises)
    .then((responses) => updateStateFromServerResponses(responses, dispatch))
    .catch((err) => {
      throw err
    })
}

const saveNewResourceTemplate = (content, group, user, dispatch) => createResourceTemplate(content, group, user)
  .then((response) => response.response)
  .catch((err) => {
    dispatch(addModalMessage(err.response))
    return err.response
  })

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

export const saveResourceTemplates = (rts, group) => async (dispatch, getState) => {
  const user = selectCurrentUser(getState())
  const responses = await Promise.all(rts.map((rt) => saveResourceTemplate(rt, group, user)))

  updateStateFromServerResponses(responses, dispatch)
}

const saveResourceTemplate = async (content, group, user) => {
  try {
    const response = await updateResourceTemplate(content, group, user)
    return response.response
  } catch (err) {
    return err.response
  }
}
