import { postTransfer, fetchResource } from "../sinopiaApi"
import { addError } from "actions/errors"
import { clearLocalIds, setLocalId } from "actions/transfer"
import rdf from "rdf-ext"

export const transfer =
  (resourceUri, group, target, localId, errorKey) => (dispatch) =>
    postTransfer(resourceUri, group, target, localId).catch((err) => {
      dispatch(
        addError(errorKey, `Error requesting transfer: ${err.message || err}`)
      )
    })

export const loadLocalIds =
  (resourceKey, sinopiaLocalAdminMetadataRefs, errorKey) => (dispatch) => {
    dispatch(clearLocalIds(resourceKey))
    return Promise.all(
      sinopiaLocalAdminMetadataRefs.map((resourceUri) =>
        dispatch(fetchLocalId(resourceUri, errorKey)).then(
          ([target, group, localId]) => {
            if (!target) {
              return Promise.resolve()
            }
            return dispatch(setLocalId(resourceKey, target, group, localId))
          }
        )
      )
    )
  }

const fetchLocalId = (uri, errorKey) => (dispatch) =>
  fetchResource(uri)
    .then(([dataset, response]) => {
      if (!dataset) return [false, false, false]
      const identifierNode = identifierNodeFromDataset(uri, dataset)
      if (!identifierNode) return [false, false, false]
      const localId = localIdFromIdentifierNode(identifierNode, dataset)
      const target = targetFromIdentifierNode(identifierNode, dataset)
      return [target, response.group, localId]
    })
    .catch((err) => {
      dispatch(
        addError(errorKey, `Error retrieving ${uri}: ${err.message || err}`)
      )
      return [false, false, false]
    })

const localIdFromIdentifierNode = (identifierNode, dataset) =>
  dataset
    .match(
      identifierNode,
      rdf.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#value")
    )
    .toArray()[0].object.value

const targetFromIdentifierNode = (identifierNode, dataset) => {
  const sourceNode = dataset
    .match(
      identifierNode,
      rdf.namedNode("http://id.loc.gov/ontologies/bibframe/source")
    )
    .toArray()[0].object
  return dataset
    .match(
      sourceNode,
      rdf.namedNode("http://www.w3.org/2000/01/rdf-schema#label")
    )
    .toArray()[0].object.value
}

const identifierNodeFromDataset = (uri, dataset) =>
  dataset
    .match(
      rdf.namedNode(uri),
      rdf.namedNode("http://id.loc.gov/ontologies/bibframe/identifier")
    )
    .toArray()[0].object
