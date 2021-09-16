// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { MultiSelect } from 'react-multi-select-component'
import Config from 'Config'
import { hideModal } from 'actions/modals'
import { resourceEditErrorKey } from './Editor'
import { selectModalType } from 'selectors/modals'
import { saveNewResource } from 'actionCreators/resources'
import ModalWrapper, { useDisplayStyle, useModalCss } from '../ModalWrapper'
import { selectCurrentResourceKey } from 'selectors/resources'
import { selectGroups } from 'selectors/authenticate'

const GroupChoiceModal = () => {
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const modalType = useSelector((state) => selectModalType(state))
  const userGroupIds = useSelector((state) => selectGroups(state))
  const [ownerGroupId, setOwnerGroupId] = useState(userGroupIds[0])
  const [editGroupValues, setEditGroupValues] = useState([])
  const groupMap = Config.groupsInSinopia
  const show = modalType === 'GroupChoiceModal'
  const dispatch = useDispatch()

  // TODO: Handle owner group in edit groups. Should be selected and disabled.

  const ownerGroupOptions = userGroupIds.map((groupId) => <option key={groupId} value={ groupId }>{ groupMap[groupId] || groupId }</option>)

  // The ld4p group is only for templates
  const editGroupOptions = Object.entries(groupMap)
    .filter(([groupId]) => ![ownerGroupId, 'ld4p'].includes(groupId))
    .sort(([, groupLabelA], [, groupLabelB]) => groupLabelA.localeCompare(groupLabelB))
    .map(([value, label]) => ({ value, label, disabled: value === ownerGroupId }))

  const handleOwnerChange = (event) => {
    const newOwnerGroupId = event.target.value
    setOwnerGroupId(newOwnerGroupId)
    setEditGroupValues(editGroupValues.filter((groupValue) => groupValue.value !== newOwnerGroupId))
    event.preventDefault()
  }

  const handleEditChange = (values) => {
    setEditGroupValues(values)
  }

  const saveAndClose = (event) => {
    const editGroupIds = editGroupValues.map((editGroupValue) => editGroupValue.value)
    dispatch(saveNewResource(resourceKey, ownerGroupId, editGroupIds, resourceEditErrorKey(resourceKey)))
    dispatch(hideModal())
    event.preventDefault()
  }

  const close = (event) => {
    dispatch(hideModal())
    event.preventDefault()
  }

  const modal = (
    <div>
      <div className={ useModalCss(show) }
           role="dialog"
           tabIndex="-1"
           id="group-choice-modal"
           data-testid="group-choice-modal"
           style={{ display: useDisplayStyle(show) }}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header prop-heading">
              <button type="button" className="btn-close" onClick={ close } aria-label="Close"></button>
            </div>
            <div className="modal-body group-panel">
              <label htmlFor="ownerSelect"><h4>Who owns this?</h4></label>
              <select
                className="form-select mb-4"
                id="ownerSelect"
                onBlur={handleOwnerChange}
                onChange={handleOwnerChange}
                value={ownerGroupId}>
                { ownerGroupOptions }
              </select>
              <h4 id="editSelectLabel">Who else can edit?</h4>
              <MultiSelect
                options={editGroupOptions}
                value={editGroupValues}
                onChange={handleEditChange}
                hasSelectAll={false}
                labelledBy="editSelectLabel"
              />
              <div>
                <div className="group-choose-buttons">
                  <button className="btn btn-link btn-sm" style={{ paddingRight: '20px' }} onClick={ close }>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" data-dismiss="modal" aria-label="Save Group" onClick={ saveAndClose }>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (<ModalWrapper modal={modal} />)
}

GroupChoiceModal.propTypes = {
  closeGroupChooser: PropTypes.func,
  choose: PropTypes.func,
  resourceKey: PropTypes.string,
}

export default GroupChoiceModal
