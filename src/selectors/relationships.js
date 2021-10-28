import { selectNormSubject } from "./resources"
import _ from "lodash"

// Merges relationships from the resource and inferred relationships
export const selectRelationships = (state, resourceKey) => {
  const resource = selectNormSubject(state, resourceKey) || emptyRelationships
  const relationships =
    state.entities.relationships[resourceKey] || emptyRelationships

  const mergeRelationship = (field) =>
    _.uniq([...resource[field], ...relationships[field]])

  return {
    bfAdminMetadataRefs: mergeRelationship("bfAdminMetadataRefs"),
    bfItemRefs: mergeRelationship("bfItemRefs"),
    bfInstanceRefs: mergeRelationship("bfInstanceRefs"),
    bfWorkRefs: mergeRelationship("bfWorkRefs"),
  }
}

const emptyRelationships = {
  bfAdminMetadataRefs: [],
  bfItemRefs: [],
  bfInstanceRefs: [],
  bfWorkRefs: [],
}

export const hasRelationships = (state, resourceKey) => {
  const { bfAdminMetadataRefs, bfItemRefs, bfInstanceRefs, bfWorkRefs } =
    selectRelationships(state, resourceKey)
  return (
    !_.isEmpty(bfAdminMetadataRefs) ||
    !_.isEmpty(bfItemRefs) ||
    !_.isEmpty(bfInstanceRefs) ||
    !_.isEmpty(bfWorkRefs)
  )
}
