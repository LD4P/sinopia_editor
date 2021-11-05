// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import PropTypes from "prop-types"
import Config from "Config"

const CanvasMenu = (props) => {
  const [content, setContent] = useState(null)

  useEffect(() => {
    // Logging error here is OK because component displays appropriately when failed.
    fetch(Config.sinopiaHelpAndResourcesMenuContent)
      .then((response) => response.text())
      .then((data) => setContent(data))
      .catch((error) =>
        console.error(
          `Error loading ${
            Config.sinopiaHelpAndResourcesMenuContent
          }: ${error.toString()}`
        )
      )
  }, [])

  return (
    <div>
      <button
        type="button"
        aria-label="Close Help Menu"
        className="btn pull-right"
        href="#"
        onClick={props.closeHandleMenu}
      >
        <FontAwesomeIcon className="close-icon" icon={faTimes} />
      </button>

      {content ? (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      ) : (
        <div className="alert alert-warning" role="alert">
          Help and Resources not loaded.
        </div>
      )}
    </div>
  )
}

CanvasMenu.propTypes = {
  closeHandleMenu: PropTypes.func,
}

export default CanvasMenu
