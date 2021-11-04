// Copyright 2019 Stanford University see LICENSE for license

import React, { useMemo } from "react"
import PropTypes from "prop-types"
import Header from "../Header"
import { useSelector } from "react-redux"
import Config from "Config"
import { selectExports } from "selectors/exports"
import AlertsContextProvider from "components/alerts/AlertsContextProvider"
import ContextAlert from "components/alerts/ContextAlert"

export const exportsErrorKey = "exports"

const Exports = (props) => {
  const exportFiles = useSelector((state) => selectExports(state))

  const sortedExportFiles = useMemo(
    () => exportFiles.sort((a, b) => a.localeCompare(b)),
    [exportFiles]
  )

  const exportFileList = sortedExportFiles.map((exportFile) => (
    <li key={exportFile}>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${Config.exportBucketUrl}/${exportFile}`}
      >
        {exportFile}
      </a>
    </li>
  ))

  return (
    <AlertsContextProvider value={exportsErrorKey}>
      <div id="exports">
        <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
        <ContextAlert />
        <h3>Exports</h3>
        <p className="text-muted">
          Exports are regenerated weekly. Each zip file contains separate files
          per record (as JSON-LD).
        </p>
        <ul className="list-unstyled">{exportFileList}</ul>
      </div>
    </AlertsContextProvider>
  )
}

Exports.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default Exports
