// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import { fetchResourceVersions } from "sinopiaApi"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en.json"
import {
  loadResourceForDiff,
  loadResourceForPreview,
} from "actionCreators/resources"
import { setCurrentDiff, setVersions } from "actions/resources"
import { showModal } from "actions/modals"
import VersionPreviewModal from "../preview/VersionPreviewModal"
import DiffModal from "./DiffModal"
import { selectVersions } from "selectors/resources"
import ViewButton from "../../buttons/ViewButton"
import useAlerts from "hooks/useAlerts"
import _ from "lodash"

const Versions = ({ resource }) => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()
  const versions = useSelector((state) => selectVersions(state, resource.key))

  const [compareFrom, setCompareFrom] = useState()
  const [compareTo, setCompareTo] = useState("current")
  const [canDiff, setCanDiff] = useState(true)
  const [isLoadingView, setLoadingView] = useState(false)
  TimeAgo.addLocale(en)
  const timeAgo = new TimeAgo()

  const handleView = (event, timestamp) => {
    event.preventDefault()
    setLoadingView(timestamp)
    dispatch(
      loadResourceForPreview(resource.uri, errorKey, { version: timestamp })
    ).then((result) => {
      setLoadingView(false)
      if (result) dispatch(showModal("VersionPreviewModal"))
    })
  }

  useEffect(() => {
    if (!_.isEmpty(versions)) return
    fetchResourceVersions(resource.uri).then((newVersions) => {
      dispatch(setVersions(resource.key, newVersions.reverse()))
      setCompareFrom(_.first(newVersions).timestamp)
    })
  }, [resource.uri, resource.key, versions, dispatch])

  if (!versions) {
    return <React.Fragment>Loading ...</React.Fragment>
  }

  const handleCompareFromClick = (event) => {
    setCanDiff(event.target.value !== compareTo)
    setCompareFrom(event.target.value)
  }

  const handleCompareToClick = (event) => {
    setCanDiff(event.target.value !== compareFrom)
    setCompareTo(event.target.value)
  }

  const handleCompareClick = (event) => {
    event.preventDefault()

    const loadPromises = []
    if (compareFrom === "current") {
      dispatch(setCurrentDiff({ compareFromResourceKey: resource.key }))
    } else {
      loadPromises.push(
        dispatch(
          loadResourceForDiff(
            resource.uri,
            errorKey,
            "compareFromResourceKey",
            { version: compareFrom }
          )
        )
      )
    }

    if (compareTo === "current") {
      dispatch(setCurrentDiff({ compareToResourceKey: resource.key }))
    } else {
      loadPromises.push(
        dispatch(
          loadResourceForDiff(resource.uri, errorKey, "compareToResourceKey", {
            version: compareTo,
          })
        )
      )
    }

    Promise.all(loadPromises).then((results) => {
      if (results.every((result) => result)) {
        dispatch(showModal("DiffModal"))
      }
    })
  }

  const createRow = (id, shortLabel, label) => (
    <div className="row" key={id}>
      <div className="form-check col-auto ps-5">
        <input
          className="form-check-input"
          type="radio"
          value={id}
          checked={compareFrom === id}
          onChange={handleCompareFromClick}
          id={`comparefrom-${id}`}
          data-testid={`Compare from ${shortLabel}`}
        />
        <label className="visually-hidden" htmlFor={`comparefrom-${id}`}>
          Compare from {shortLabel}
        </label>
      </div>
      <div className="form-check col-auto">
        <input
          className="form-check-input"
          type="radio"
          value={id}
          checked={compareTo === id}
          onChange={handleCompareToClick}
          id={`compareto-${id}`}
          data-testid={`Compare to ${shortLabel}`}
        />
        <label className="visually-hidden" htmlFor={`compareto-${id}`}>
          Compare to {shortLabel}
        </label>
      </div>
      <div className="col-auto">
        {label}
        {id !== "current" && (
          <ViewButton
            label={`version {versionIndex}`}
            handleClick={(event) => handleView(event, id)}
            size="sm"
            isLoading={isLoadingView === id}
          />
        )}
      </div>
    </div>
  )

  const versionRows = versions.map((version, index) => {
    const versionIndex = versions.length - index
    return createRow(
      version.timestamp,
      `version ${versionIndex}`,
      `Version ${versionIndex} from ${timeAgo.format(
        new Date(version.timestamp)
      )} by ${version.user}`
    )
  })
  const rows = [
    createRow("current", "current version", "Current version (in Editor)"),
    ...versionRows,
  ]

  return (
    <React.Fragment>
      <div className="row">
        <div className="col form-text">Compare from/to</div>
      </div>
      {rows}
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        disabled={!canDiff}
        onClick={handleCompareClick}
      >
        Compare
      </button>
      <VersionPreviewModal />
      <DiffModal />
    </React.Fragment>
  )
}

Versions.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default Versions
