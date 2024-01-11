// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowAltCircleUp } from "@fortawesome/free-solid-svg-icons"

const TopButton = () => {
  const handleClick = (event) => {
    window.scrollTo(0, 0)
    event.preventDefault()
  }

  return (
    <button
      type="button"
      className="btn btn-link"
      aria-label="Go to top"
      title="Go to top"
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faArrowAltCircleUp} className="icon-lg" /> Top
    </button>
  )
}

export default TopButton
