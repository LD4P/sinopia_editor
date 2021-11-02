import React from "react"
import PropTypes from "prop-types"
import { FileEarmarkPlusFill } from "react-bootstrap-icons"
import LoadingButton from "./LoadingButton"

const sizeMap = {
  lg: 32,
}

const NewButton = ({ label, handleClick, isLoading = false, size = "lg" }) => {
  if (isLoading) return <LoadingButton />

  const sizeValue = sizeMap[size]
  if (!sizeValue) console.error("Unknown size", size)

  return (
    <button
      className="btn btn-link"
      title="Create"
      aria-label={`Create resource for ${label}`}
      data-testid={`Create resource for ${label}`}
      onClick={handleClick}
    >
      <FileEarmarkPlusFill size={sizeValue || 32} />
    </button>
  )
}

NewButton.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  size: PropTypes.string,
}

export default NewButton
