import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-solid-svg-icons"
import LoadingButton from "./LoadingButton"

const ViewButton = ({ label, handleClick, isLoading = false, size = "lg" }) => {
  if (isLoading) return <LoadingButton />

  return (
    <button
      className="btn btn-link"
      title="View"
      aria-label={`View ${label}`}
      data-testid={`View ${label}`}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faEye} className={`icon-${size}`} />
    </button>
  )
}

ViewButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  size: PropTypes.string,
}

export default ViewButton
