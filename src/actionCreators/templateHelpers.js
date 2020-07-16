import { addTemplates } from 'actions/templates'
import { getResourceTemplate } from 'sinopiaServer'
import { selectSubjectAndPropertyTemplates } from 'selectors/templates'
import TemplatesBuilder from 'TemplatesBuilder'

/**
 * Helper methods that should only be used in 'actionCreators/templates'
 */

/**
 * A thunk that gets a resource template from state or the server and transforms to
 * subject template and property template models and adds to state.
 * Validation is not performed. This means that invalid templates can be stored in state.
 * @return [Object] subject template
 * @throws when error occurs retrieving the resource template.
 */
export const loadResourceTemplateWithoutValidation = (resourceTemplateId) => (dispatch, getState) => {
  // Try to get it from state.
  const subjectTemplate = selectSubjectAndPropertyTemplates(getState(), resourceTemplateId)
  if (subjectTemplate) return Promise.resolve(subjectTemplate)

  return getResourceTemplate(resourceTemplateId, 'ld4p')
    .then((response) => {
      // If resource template loads, then validate.
      const resourceTemplate = response.response.body
      const subjectTemplate = new TemplatesBuilder(resourceTemplate).build()
      dispatch(addTemplates(subjectTemplate))
      return subjectTemplate
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

export const noop = () => {}
