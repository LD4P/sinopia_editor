/* eslint max-params: ["error", 5] */
import { useState, useEffect } from 'react'
import ResourceStateBuilder from 'ResourceStateBuilder'
import { rdfDatasetFromN3 } from 'Utilities'
import { useDispatch } from 'react-redux'
import { fetchResourceTemplate } from 'actionCreators/resourceTemplates'
/**
 * Hook for transforming a resource to state and changing the page to the editor (i.e., /editor path).
 * @param {string} resource as N3
 * @param {string} baseURI of the resource
 * @param {string} resourceTemplateId to use for the resource
 * @param {string} rootResource from state to determine when it is safe to change to editor
 * @param {Object} history react-router history object
  * @return {[Object, rdf.Dataset, string]} resource state, unused RDF, error
 */
const useResource = (resourceN3, baseURI, resourceTemplateId, rootResource, history) => {
  // Indicates that would like to change to editor once resource is in state
  const [navigateEditor, setNavigateEditor] = useState(false)
  const [error, setError] = useState('')
  const [resourceState, setResourceState] = useState(null)
  const [unusedDataset, setUnusedDataset] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    // Using undefined for baseURI because some resources have <> base URIs, which would be '' or null.
    if (!resourceN3 || baseURI === undefined || !resourceTemplateId) {
      return
    }
    rdfDatasetFromN3(resourceN3).then((dataset) => {
      const builder = new ResourceStateBuilder(dataset, (rtId) => dispatch(fetchResourceTemplate(rtId)), baseURI, resourceTemplateId)
      return builder.buildState().then((result) => {
        // TODO: This also returns the resource templates, which could be added to state.
        // See https://github.com/LD4P/sinopia_editor/issues/1396
        setResourceState(result[0])
        setUnusedDataset(result[1])
        setNavigateEditor(true)
      }).catch(err => setError(err))
    }).catch(err => setError(`Error parsing: ${err}`))
  }, [resourceN3, baseURI, resourceTemplateId])

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && rootResource) {
      history.push('/editor')
    }
  }, [rootResource, navigateEditor, history])

  return [resourceState, unusedDataset, error]
}

export default useResource
