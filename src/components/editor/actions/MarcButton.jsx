// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useRef } from "react"
import { useSelector, shallowEqual } from "react-redux"
import PropTypes from "prop-types"
import { postMarc, getMarcJob, getMarc } from "sinopiaApi"
import { selectPickSubject } from "selectors/resources"
import { isBfInstance } from "utilities/Bibframe"
import { saveAs } from "file-saver"
import { nanoid } from "nanoid"

const MarcButton = ({ resourceKey }) => {
  const marcs = useRef({})
  const resource = useSelector(
    (state) =>
      selectPickSubject(state, resourceKey, [
        "uri",
        "subjectTemplateKey",
        "classes",
      ]),
    shallowEqual
  )
  const [, setRender] = useState(false)

  if (!resource?.uri || !isBfInstance(resource?.classes)) return null

  const marcJobTimer = (marcJobUrl, resourceKey) => {
    getMarcJob(marcJobUrl)
      .then(([url, body]) => {
        if (!url) {
          setTimeout(marcJobTimer, 10000, marcJobUrl, resourceKey)
          return
        }
        marcs.current[resourceKey] = { marc: body, marcUrl: url }
        setRender(nanoid())
      })
      .catch((err) => {
        marcs.current[resourceKey] = { error: err.message || err }
        setRender(nanoid())
      })
  }

  const handleRequest = (event) => {
    delete marcs.current[resourceKey]
    postMarc(resource.uri)
      .then((marcJobUrl) => {
        marcJobTimer(marcJobUrl, resourceKey)
      })
      .catch((err) => {
        marcs.current[resourceKey] = { error: err.message || err }
        setRender(nanoid())
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

  const btnClasses = ["btn", "dropdown-toggle", "btn-no-outline"]
  if (marcs.current[resourceKey]?.marc) {
    btnClasses.push("btn-success")
  } else if (marcs.current[resourceKey]?.error) {
    btnClasses.push("btn-danger")
  } else {
    btnClasses.push("btn-secondary")
  }
  const dropDownItemBtnClasses = ["btn", "btn-secondary", "dropdown-item"]

  return (
    <div className="btn-group dropstart">
      <button
        type="button"
        id="marcBtn"
        className={btnClasses.join(" ")}
        aria-label="MARC record"
        title="MARC record"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Request MARC
      </button>
      <div className="separator-circle">•</div>
      <div className="dropdown-menu" aria-labelledby="marcBtn">
        <button
          className={dropDownItemBtnClasses.join(" ")}
          onClick={(event) => handleRequest(event)}
        >
          Request conversion to MARC
        </button>
        {marcs.current[resourceKey]?.marc && (
          <React.Fragment>
            <button
              className={dropDownItemBtnClasses.join(" ")}
              onClick={(event) => handleDownloadTxt(event)}
            >
              Download text
            </button>
            <button
              className={dropDownItemBtnClasses.join(" ")}
              onClick={(event) => handleDownloadMarc(event)}
            >
              Download MARC
            </button>
            <pre
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                paddingLeft: "10px",
                paddingRight: "10px",
                maxWidth: "750px",
              }}
            >
              <bdi>{marcs.current[resourceKey].marc}</bdi>
            </pre>
          </React.Fragment>
        )}
        {marcs.current[resourceKey]?.error && (
          <div
            className="alert alert-danger"
            role="alert"
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            {marcs.current[resourceKey].error}
          </div>
        )}
      </div>
    </div>
  )
}

MarcButton.propTypes = {
  resourceKey: PropTypes.string.isRequired,
}

export default MarcButton
