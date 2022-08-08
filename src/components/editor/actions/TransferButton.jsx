import React, { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { selectLocalId } from "selectors/transfer"
import PropTypes from "prop-types"
import _ from "lodash"

const TransferButton = ({
  label,
  group,
  target,
  resourceKey,
  handleTransfer,
}) => {
  const [requesting, setRequesting] = useState(false)
  const localId = useSelector((state) =>
    selectLocalId(state, resourceKey, target, group)
  )
  const [providedLocalId, setProvidedLocalId] = useState(localId)
  const timerRef = useRef(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  const handleExistingLocalIdClick = (event) => {
    handleTransfer(localId)
    notify()
    event.preventDefault()
  }

  const handleProvidedLocalIdClick = (event) => {
    handleTransfer(providedLocalId)
    notify()
    event.preventDefault()
  }

  const handleNoLocalIdClick = (event) => {
    handleTransfer(null)
    notify()
    event.preventDefault()
  }

  const notify = () => {
    setRequesting(true)
    timerRef.current = setTimeout(() => setRequesting(false), 3000)
  }

  const handleChangeProvidedLocalId = (event) => {
    setProvidedLocalId(event.target.value)
    event.preventDefault()
  }

  if (requesting) {
    return (
      <button type="button" className="btn btn-secondary btn-no-outline">
        <em>Requesting</em>
      </button>
    )
  }

  const btnId = `transferBtn-${group}-${target}`
  const btnClasses = ["btn", "dropdown-toggle", "btn-no-outline"]
  const dropDownItemBtnClasses = ["btn", "btn-secondary", "dropdown-item"]

  return (
    <div className="btn-group dropdown">
      <button
        type="button"
        id={btnId}
        className={btnClasses.join(" ")}
        aria-label="Transfer to catalog"
        title="Transfer to catalog"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {label}
      </button>
      <div className="dropdown-menu dropdown-menu-end" aria-labelledby={btnId}>
        {localId ? (
          <React.Fragment>
            <button
              className={dropDownItemBtnClasses.join(" ")}
              onClick={handleExistingLocalIdClick}
            >
              Export with local system ID: {localId}
            </button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="dropdown-item">
              Overlay record with local system ID:
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  aria-label="Enter local system id"
                  onChange={handleChangeProvidedLocalId}
                  value={providedLocalId}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={_.isEmpty(providedLocalId)}
                  onClick={handleProvidedLocalIdClick}
                >
                  Go
                </button>
              </div>
            </div>
            <button
              className={dropDownItemBtnClasses.join(" ")}
              onClick={handleNoLocalIdClick}
            >
              Create a new record in catalog.
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

TransferButton.propTypes = {
  label: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  resourceKey: PropTypes.string.isRequired,
  handleTransfer: PropTypes.func.isRequired,
}

export default TransferButton
