// Copyright 2020 Stanford University see LICENSE for license

import { setRelationships } from "actions/resources"
import { clearErrors, addError } from "actions/errors"
import { fetchResourceRelationships } from "sinopiaApi"

/**
 * A thunk that loads inferred relationships from the Sinopia API and adds to state.
 * @return true if successful
 */
export const loadRelationships = (resourceKey, uri, errorKey) => (dispatch) => {
  dispatch(clearErrors(errorKey))
  return fetchResourceRelationships(uri)
    .then((relationships) => {
      dispatch(
        setRelationships(resourceKey, {
          bfAdminMetadataRefs: relationships.bfAdminMetadataInferredRefs,
          bfItemRefs: relationships.bfItemInferredRefs,
          bfInstanceRefs: relationships.bfInstanceInferredRefs,
          bfWorkRefs: relationships.bfWorkInferredRefs,
        })
      )
      return true
    })
    .catch((err) => {
      console.error(err)
      dispatch(
        addError(
          errorKey,
          `Error retrieving relationships for ${uri}: ${err.message || err}`
        )
      )
      return false
    })
}

export const noop = () => {}
