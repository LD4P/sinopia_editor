// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { hideModal } from "actions/modals"
import { isCurrentModal } from "selectors/modals"
import {
  selectCurrentDiffResourceKeys,
  selectFullSubject,
} from "selectors/resources"
import ModalWrapper, {
  useDisplayStyle,
  useModalCss,
} from "components/ModalWrapper"
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
  if (compareFromResource && compareToResource)
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

  const modal = (
    <div>
      <div
        className={useModalCss(show)}
        role="dialog"
        tabIndex="-1"
        id="diff-modal"
        data-testid="diff-modal"
        style={{ display: useDisplayStyle(show) }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="view-resource-modal-title">
                Compare
              </h4>
              <button
                type="button"
                className="btn-close"
                onClick={close}
                aria-label="Close"
                data-testid="Close"
              ></button>
            </div>
            <div className="modal-body">
              {diff && <DiffDisplay diff={diff} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return <ModalWrapper modal={modal} />
}

export default DiffModal
