import { selectNormSubject } from "./resources"
import _ from "lodash"

// Merges relationships from the resource and inferred relationships
export const selectRelationships = (state, resourceKey) => {
  const resource = selectNormSubject(state, resourceKey) || emptyRelationships
  const relationships =
    state.entities.relationships[resourceKey] || emptyRelationships

  const mergeRelationship = (field) => {
    const resourceRelationships = resource[field] || []
    const inferredRelationships = relationships[field] || []
    return _.uniq([...resourceRelationships, ...inferredRelationships])
  }

  const adminMetadataRefs = _.uniq([
    ...(resource?.sinopiaLocalAdminMetadataRefs || []),
    ...(relationships?.sinopiaHasLocalAdminMetadataInferredRefs || []),
  ])

  return {
    bfAdminMetadataRefs: mergeRelationship("bfAdminMetadataRefs"),
    bfItemRefs: mergeRelationship("bfItemRefs"),
    bfInstanceRefs: mergeRelationship("bfInstanceRefs"),
    bfWorkRefs: mergeRelationship("bfWorkRefs"),
    sinopiaLocalAdminMetadataRefs: adminMetadataRefs,
  }
}

const emptyRelationships = {
  bfAdminMetadataRefs: [],
  bfItemRefs: [],
  bfInstanceRefs: [],
  bfWorkRefs: [],
}

export const hasRelationships = (state, resourceKey) =>
  !isEmpty(selectRelationships(state, resourceKey))

export const hasSearchRelationships = (state, uri) =>
  !isEmpty(selectSearchRelationships(state, uri))

export const selectSearchRelationships = (state, uri) => {
  const relationshipResults = state.search.resource?.relationshipResults || {}
  return relationshipResults[uri]
}

const isEmpty = (relationships) => {
  if (_.isEmpty(relationships)) return true
  return Object.values(relationships).every((refs) => _.isEmpty(refs))
}
