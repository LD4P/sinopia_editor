// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import PropTypes from "prop-types"
import { postMarc, getMarcJob, getMarc } from "sinopiaApi"
import { selectPickSubject } from "selectors/resources"
import { isBfInstance } from "utilities/Bibframe"
import { saveAs } from "file-saver"
import { showMarcModal } from "actions/modals"
import useAlerts from "hooks/useAlerts"
import { clearErrors, addError } from "actions/errors"

const MarcButton = ({ resourceKey }) => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()
  const marcs = useRef({})
  const isMounted = useRef(false)
  const resource = useSelector(
    (state) =>
      selectPickSubject(state, resourceKey, [
        "uri",
        "subjectTemplateKey",
        "classes",
      ]),
    shallowEqual
  )

  const [isRequesting, setRequesting] = useState(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  })

  if (!resource?.uri || !isBfInstance(resource?.classes)) return null

  const marcJobTimer = (marcJobUrl, resourceKey) => {
    getMarcJob(marcJobUrl)
      .then(([url, body]) => {
        if (!isMounted.current) return
        if (!url) {
          setTimeout(marcJobTimer, 10000, marcJobUrl, resourceKey)
          return
        }
        marcs.current[resourceKey] = { marc: body, marcUrl: url }
        setRequesting(false)
      })
      .catch((err) => {
        if (!isMounted.current) return
        dispatch(
          addError(errorKey, `Error requesting MARC: ${err.message || err}`)
        )
        setRequesting(false)
      })
  }

  const handleRequest = (event) => {
    setRequesting(true)
    dispatch(clearErrors(errorKey))
    delete marcs.current[resourceKey]
    postMarc(resource.uri)
      .then((marcJobUrl) => {
        if (!isMounted.current) return
        setTimeout(marcJobTimer, 1000, marcJobUrl, resourceKey)
      })
      .catch((err) => {
        if (!isMounted.current) return
        dispatch(
          addError(errorKey, `Error requesting MARC: ${err.message || err}`)
        )
        setRequesting(false)
      })
    event.preventDefault()
  }

  const handleDownloadTxt = (event) => {
    const blob = new Blob([marcs.current[resourceKey].marc], {
      type: "text/plain;charset=utf-8",
    })
    saveAs(blob, `record-${resource.uri}.txt`)
    event.preventDefault()
  }

  const handleDownloadMarc = (event) => {
    getMarc(marcs.current[resourceKey].marcUrl)
      .then((blob) => {
        saveAs(blob, `record-${resource.uri}.mar`)
      })
      .catch(
        (err) => (marcs.current[resourceKey] = { error: err.message || err })
      )
    event.preventDefault()
  }

  const handleViewMarc = (event) => {
    dispatch(showMarcModal(marcs.current[resourceKey].marc))
    event.preventDefault()
  }

  const btnClasses = ["btn", "dropdown-toggle", "btn-no-outline"]
  const dropDownItemBtnClasses = ["btn", "btn-secondary", "dropdown-item"]

  if (isRequesting) {
    return (
      <React.Fragment>
        <button
          type="button"
          id="marcBtn"
          className="btn btn-no-outline"
          aria-label="MARC record"
          title="MARC record"
          disabled={true}
        >
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          Requesting MARC ...
        </button>
        <div className="separator-circle">•</div>
      </React.Fragment>
    )
  }

  return (
    <div className="btn-group dropdown">
      <button
        type="button"
        id="marcBtn"
        className={btnClasses.join(" ")}
        aria-label="MARC record"
        title="MARC record"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        MARC
      </button>
      <div className="separator-circle">•</div>
      <div className="dropdown-menu" aria-labelledby="marcBtn">
        <button
          className={dropDownItemBtnClasses.join(" ")}
          onClick={handleRequest}
        >
          Request conversion to MARC
        </button>
        {marcs.current[resourceKey]?.marc && (
          <React.Fragment>
            <button
              className={dropDownItemBtnClasses.join(" ")}
              onClick={handleViewMarc}
            >
              View MARC
            </button>
            <button
              className={dropDownItemBtnClasses.join(" ")}
              onClick={handleDownloadTxt}
            >
              Download text
            </button>
            <button
              className={dropDownItemBtnClasses.join(" ")}
              onClick={handleDownloadMarc}
            >
              Download MARC
            </button>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}

MarcButton.propTypes = {
  resourceKey: PropTypes.string.isRequired,
}

export default MarcButton
