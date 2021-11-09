import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import LoadingButton from "./LoadingButton"

const CopyButton = ({ label, handleClick, isLoading = false, size = "lg" }) => {
  if (isLoading) return <LoadingButton />

  return (
    <button
      className="btn btn-link"
      title="Copy"
      aria-label={`Copy ${label}`}
      data-testid={`Copy ${label}`}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faCopy} className={`icon-${size}`} />
    </button>
  )
}

CopyButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  size: PropTypes.string,
}

export default CopyButton
