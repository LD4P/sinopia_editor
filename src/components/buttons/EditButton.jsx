import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import LoadingButton from "./LoadingButton"

const EditButton = ({ label, handleClick, isLoading = false, size = "lg" }) => {
  if (isLoading) return <LoadingButton />

  return (
    <button
      className="btn btn-link"
      title="Edit"
      aria-label={`Edit ${label}`}
      data-testid={`Edit ${label}`}
      onClick={handleClick}
    >
      <FontAwesomeIcon icon={faPencilAlt} className={`icon-${size}`} />
    </button>
  )
}

EditButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  size: PropTypes.string,
}

export default EditButton
