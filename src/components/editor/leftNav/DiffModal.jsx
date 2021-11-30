// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { hideModal } from "actions/modals"
import { isCurrentModal } from "selectors/modals"
import {
  selectCurrentDiffResourceKeys,
  selectFullSubject,
} from "selectors/resources"
import ModalWrapper from "components/ModalWrapper"
import { setCurrentDiff } from "actions/resources"
import ResourceDiffer from "ResourceDiffer"
import DiffDisplay from "./DiffDisplay"

const DiffModal = () => {
  const dispatch = useDispatch()
  const { compareFrom, compareTo } = useSelector((state) =>
    selectCurrentDiffResourceKeys(state)
  )
  const show = useSelector((state) => isCurrentModal(state, "DiffModal"))
  const compareFromResource = useSelector((state) =>
    selectFullSubject(state, compareFrom)
  )
  const compareToResource = useSelector((state) =>
    selectFullSubject(state, compareTo)
  )

  let diff = null
  if (show && compareFromResource && compareToResource)
    diff = new ResourceDiffer(compareFromResource, compareToResource).diff

  const close = (event) => {
    dispatch(hideModal())
    dispatch(
      setCurrentDiff({
        compareFromResourceKey: null,
        compareToResourceKey: null,
      })
    )
    event.preventDefault()
  }

  const header = (
    <h4 className="modal-title" id="view-resource-modal-title">
      Compare
    </h4>
  )

  const body = diff ? <DiffDisplay diff={diff} /> : null

  return (
    <ModalWrapper
      modalName="DiffModal"
      ariaLabel="Compare"
      data-testid="diff-modal"
      handleClose={close}
      header={header}
      body={body}
    />
  )
}

export default DiffModal
