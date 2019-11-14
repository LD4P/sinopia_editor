/* eslint max-params: ["error", 5] */
import { useState, useEffect } from 'react'
import ResourceStateBuilder from 'ResourceStateBuilder'
import { rdfDatasetFromN3 } from 'Utilities'
import { useDispatch, useSelector } from 'react-redux'
import { existingResource } from 'actionCreators/resources'
import { appendError, clearErrors, setResourceTemplates } from 'actions/index'
import { hasResource as hasResourceSelector } from 'selectors/resourceSelectors'

/**
 * Hook for transforming a resource to state and changing the page to the editor (i.e., /editor path).
 * @param {string} resource as N3
 * @param {string} baseURI of the resource
 * @param {string} resourceTemplateId to use for the resource
 * @param {string} errorKey to use when adding errors to state
 * @param {Object} history react-router history object
  * @return {[Object, rdf.Dataset, string]} resource state, unused RDF, error
 */
const useResource = (resourceN3, baseURI, resourceTemplateId, errorKey, history) => {
  const dispatch = useDispatch()
  const hasResource = useSelector(state => hasResourceSelector(state))

  // Indicates that would like to change to editor once resource is in state
  const [navigateEditor, setNavigateEditor] = useState(false)

  useEffect(() => {
    if (!resourceN3 || baseURI === undefined || !resourceTemplateId) {
      return
    }
    dispatch(clearErrors(errorKey))
    rdfDatasetFromN3(resourceN3).then((dataset) => {
      const builder = new ResourceStateBuilder(dataset, baseURI, resourceTemplateId)

      return builder.buildState().then((result) => {
        const resourceState = result[0]
        const unusedDataset = result[1]
        const resourceTemplates = result[2]
        dispatch(setResourceTemplates(resourceTemplates))
        dispatch(existingResource(resourceState, unusedDataset.toCanonical(), undefined, errorKey)).then((result) => {
          setNavigateEditor(result)
        })
      }).catch(err => dispatch(appendError(errorKey, err.toString())))
    }).catch(err => dispatch(appendError(errorKey, `Error parsing: ${err.toString()}`)))
  }, [resourceN3, baseURI, resourceTemplateId, dispatch, errorKey])

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && hasResource) {
      history.push('/editor')
    }
  }, [navigateEditor, history, hasResource])
}

export default useResource
