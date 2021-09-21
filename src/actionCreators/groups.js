// Copyright 2021 Stanford University see LICENSE for license

import { groupsReceived } from "actions/groups"
import { hasGroups } from "selectors/groups"

import { getGroups } from "sinopiaApi"

export const fetchGroups = () => (dispatch, getState) => {
  if (hasGroups(getState())) {
    return // Groups already loaded
  }

  return getGroups()
    .then((json) => {
      dispatch(groupsReceived(json))
    })
    .catch(() => false)
}

export const noop = () => {}
