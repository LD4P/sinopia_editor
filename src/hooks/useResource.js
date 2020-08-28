/* eslint max-params: ["error", 5] */
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { newResourceFromDataset } from 'actionCreators/resources'
import { clearErrors } from 'actions/errors'
import { selectCurrentResource } from 'selectors/resources'

/**
 * Hook for transforming a resource to state and changing the page to the editor (i.e., /editor path).
 * @param {rdf.Dataset} dataset containing resource
 * @param {string} baseURI of the resource
 * @param {string} resourceTemplateId to use for the resource
 * @param {string} errorKey to use when adding errors to state
 * @param {Object} history react-router history object
  * @return {[Object, rdf.Dataset, string]} resource state, unused RDF, error
 */
const useResource = (dataset, baseURI, resourceTemplateId, errorKey, history) => {
  const dispatch = useDispatch()
  const hasResource = useSelector((state) => !!selectCurrentResource(state))

  // Indicates that would like to change to editor once resource is in state
  const [navigateEditor, setNavigateEditor] = useState(false)

  useEffect(() => {
    if (!dataset || baseURI === undefined || !resourceTemplateId) {
      return
    }
    dispatch(clearErrors(errorKey))
    dispatch(newResourceFromDataset(dataset, baseURI, resourceTemplateId, errorKey, true))
      .then((result) => {
        setNavigateEditor(result)
      })
  }, [dataset, baseURI, resourceTemplateId, dispatch, errorKey])

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && hasResource) {
      history.push('/editor')
    }
  }, [navigateEditor, history, hasResource])
}

export default useResource
