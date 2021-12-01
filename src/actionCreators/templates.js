// Copyright 2019 Stanford University see LICENSE for license
import { addError } from "actions/errors"
import { validateTemplates } from "./templateValidationHelpers"
import Config from "Config"
import { addTemplates } from "actions/templates"
import { selectSubjectAndPropertyTemplates } from "selectors/templates"
import TemplatesBuilder from "TemplatesBuilder"
import { fetchResource } from "sinopiaApi"
import { resourceToName } from "../utilities/Utilities"
import { selectUser } from "selectors/authenticate"

/**
 * A thunk that gets a resource template from state or the server.
 * @return [Object] subject template
 */
export const loadResourceTemplate =
  (resourceTemplateId, resourceTemplatePromises, errorKey) => (dispatch) =>
    dispatch(
      loadResourceTemplateWithoutValidation(
        resourceTemplateId,
        resourceTemplatePromises
      )
    )
      .then((subjectTemplate) =>
        dispatch(
          validateTemplates(subjectTemplate, resourceTemplatePromises, errorKey)
        ).then((isValid) => (isValid ? subjectTemplate : null))
      )
      .catch((err) => {
        dispatch(
          addError(
            errorKey,
            `Error retrieving ${resourceTemplateId}: ${err.message || err}`
          )
        )
        return null
      })

/**
 * A thunk that gets a resource template from state or the server and transforms to
 * subject template and property template models and adds to state.
 * Validation is not performed. This means that invalid templates can be stored in state.
 * @return [Object] subject template
 * @throws when error occurs retrieving the resource template.
 */
export const loadResourceTemplateWithoutValidation =
  (resourceTemplateId, resourceTemplatePromises) => (dispatch, getState) => {
    // Try to get it from resourceTemplatePromises.
    // Using this cache since in some cases, adding to state to too slow.
    const resourceTemplatePromise =
      resourceTemplatePromises?.[resourceTemplateId]
    if (resourceTemplatePromise) {
      return resourceTemplatePromise
    }
    // Try to get it from state.
    const subjectTemplate = selectSubjectAndPropertyTemplates(
      getState(),
      resourceTemplateId
    )
    if (subjectTemplate) {
      return Promise.resolve(subjectTemplate)
    }

    const id = resourceToName(resourceTemplateId)
    const templateUri = `${Config.sinopiaApiBase}/resource/${id}`

    const newResourceTemplatePromise = fetchResource(templateUri, {
      isTemplate: true,
    }).then(([dataset, response]) => {
      const user = selectUser(getState())
      const subjectTemplate = new TemplatesBuilder(
        dataset,
        templateUri,
        user.username,
        response.group,
        response.editGroups
      ).build()
      dispatch(addTemplates(subjectTemplate))
      return subjectTemplate
    })

    if (resourceTemplatePromises)
      resourceTemplatePromises[resourceTemplateId] = newResourceTemplatePromise
    return newResourceTemplatePromise
  }
