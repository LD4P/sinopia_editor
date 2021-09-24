// Copyright 2021 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import {
  hasUser as hasUserSelector,
  selectGroups,
} from "selectors/authenticate"

const UserNotifications = () => {
  const hasUser = useSelector((state) => hasUserSelector(state))
  const userGroups = useSelector((state) => selectGroups(state))

  if (!hasUser) return null // nothing to show if not logged in
  if (userGroups.length) return null // nothing to show if the user is logged in but is in at least one group

  if (!userGroups.length) {
    // show a message if the user is not in any groups
    return (
      <div className="alert alert-warning">
        <strong>Note:</strong> Before you can create new resources or edit
        existing resources, the Sinopia administrator will need to add you to a
        permission group. Please contact&nbsp;
        <a href="mailto:sinopia_admin@stanford.edu">
          sinopia_admin@stanford.edu
        </a>
        &nbsp; to request edit permission.
      </div>
    )
  }
}
export default UserNotifications
