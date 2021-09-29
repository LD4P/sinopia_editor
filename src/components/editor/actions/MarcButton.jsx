// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useRef } from "react"
import { useSelector } from "react-redux"
import { postMarc, getMarcJob, getMarc } from "sinopiaApi"
import {
  selectCurrentResourceKey,
  selectNormSubject,
} from "selectors/resources"
import { selectSubjectTemplate } from "selectors/templates"
import { saveAs } from "file-saver"
import { nanoid } from "nanoid"

const MarcButton = () => {
  const marcs = useRef({})
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))
  const subjectTemplate = useSelector((state) =>
    selectSubjectTemplate(state, resource?.subjectTemplateKey)
  )
  const [, setRender] = useState(false)

  if (
    !resource?.uri ||
    subjectTemplate?.class !== "http://id.loc.gov/ontologies/bibframe/Instance"
  )
    return null

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

  const btnClasses = ["btn", "dropdown-toggle"]
  if (marcs.current[resourceKey]?.marc) {
    btnClasses.push("btn-success")
  } else if (marcs.current[resourceKey]?.error) {
    btnClasses.push("btn-danger")
  } else {
    btnClasses.push("btn-secondary")
  }
  const dropDownItemBtnClasses = ["btn", "btn-secondary", "dropdown-item"]

  return (
    <div className="view-resource-buttons btn-group dropstart">
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
        MARC
      </button>
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

export default MarcButton
