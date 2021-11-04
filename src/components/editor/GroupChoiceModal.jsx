// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { MultiSelect } from "react-multi-select-component"
import { hideModal } from "actions/modals"
import { isCurrentModal } from "selectors/modals"
import {
  saveNewResource,
  saveResource as saveResourceAction,
} from "actionCreators/resources"
import ModalWrapper, { useDisplayStyle, useModalCss } from "../ModalWrapper"
import {
  selectCurrentResourceKey,
  selectNormSubject,
} from "selectors/resources"
import { selectGroups } from "selectors/authenticate"
import { selectGroupMap } from "selectors/groups"
import usePermissions from "hooks/usePermissions"
import useAlerts from "hooks/useAlerts"

const groupsToGroupValues = (groupIds, groupMap, ownerGroupId = null) =>
  groupIds
    .filter((groupId) => ownerGroupId !== groupId)
    .sort((groupId1, groupId2) =>
      groupMap[groupId1]?.localeCompare(groupMap[groupId2])
    )
    .map((groupId) => ({
      value: groupId,
      label: groupMap[groupId],
      disabled: groupId === ownerGroupId,
    }))

const GroupChoiceModal = () => {
  const errorKey = useAlerts()
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))
  const show = useSelector((state) => isCurrentModal(state, "GroupChoiceModal"))
  const userGroupIds = useSelector((state) => selectGroups(state))
  const groupMap = useSelector((state) => selectGroupMap(state))
  const [ownerGroupId, setOwnerGroupId] = useState(
    resource.group || userGroupIds[0]
  )
  const [editGroupValues, setEditGroupValues] = useState(
    groupsToGroupValues(resource.editGroups, groupMap)
  )
  const ownerGroupLabel = groupMap[ownerGroupId]
  const editGroupLabels = editGroupValues
    .map((groupValue) => groupValue.label)
    .join(", ")
  const { canChangeGroups } = usePermissions()
  const canChange = canChangeGroups(resource) || !resource.uri
  const dispatch = useDispatch()

  const ownerGroupOptions = userGroupIds.map((groupId) => (
    <option key={groupId} value={groupId}>
      {groupMap[groupId] || groupId}
    </option>
  ))

  const editGroupOptions = groupsToGroupValues(
    Object.keys(groupMap),
    groupMap,
    ownerGroupId
  )

  const handleOwnerChange = (event) => {
    const newOwnerGroupId = event.target.value
    setOwnerGroupId(newOwnerGroupId)
    setEditGroupValues(
      editGroupValues.filter(
        (groupValue) => groupValue.value !== newOwnerGroupId
      )
    )
    event.preventDefault()
  }

  const handleEditChange = (values) => {
    setEditGroupValues(values)
  }

  const saveAndClose = (event) => {
    const editGroupIds = editGroupValues.map(
      (editGroupValue) => editGroupValue.value
    )
    if (resource.uri) {
      dispatch(
        saveResourceAction(resourceKey, ownerGroupId, editGroupIds, errorKey)
      )
    } else {
      dispatch(
        saveNewResource(resourceKey, ownerGroupId, editGroupIds, errorKey)
      )
    }
    dispatch(hideModal())
    event.preventDefault()
  }

  const close = (event) => {
    dispatch(hideModal())
    event.preventDefault()
  }

  const modal = (
    <div>
      <div
        className={useModalCss(show)}
        role="dialog"
        tabIndex="-1"
        id="group-choice-modal"
        data-testid="group-choice-modal"
        style={{ display: useDisplayStyle(show) }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header prop-heading">
              <button
                type="button"
                className="btn-close"
                onClick={close}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body group-panel">
              <label htmlFor="ownerSelect">
                <h4>Who owns this?</h4>
              </label>
              {canChange ? (
                <select
                  className="form-select mb-4"
                  id="ownerSelect"
                  onBlur={handleOwnerChange}
                  onChange={handleOwnerChange}
                  value={ownerGroupId}
                >
                  {ownerGroupOptions}
                </select>
              ) : (
                <p>{ownerGroupLabel}</p>
              )}
              <h4 id="editSelectLabel">Who else can edit?</h4>
              {canChange ? (
                <MultiSelect
                  options={editGroupOptions}
                  value={editGroupValues}
                  onChange={handleEditChange}
                  hasSelectAll={false}
                  labelledBy="editSelectLabel"
                />
              ) : (
                <p>{editGroupLabels} </p>
              )}
              <div>
                <div className="group-choose-buttons">
                  <button
                    className="btn btn-link btn-sm"
                    style={{ paddingRight: "20px" }}
                    onClick={close}
                    aria-label="Cancel Save Group"
                  >
                    Cancel
                  </button>
                  {canChange && (
                    <button
                      className="btn btn-primary btn-sm"
                      data-dismiss="modal"
                      aria-label="Save Group"
                      data-testid="Save Group"
                      onClick={saveAndClose}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return <ModalWrapper modal={modal} />
}

export default GroupChoiceModal
