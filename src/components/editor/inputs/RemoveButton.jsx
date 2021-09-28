import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

const RemoveButton = ({ content, handleClick }) => (
  <button
    type="button"
    className="btn btn-sm"
    aria-label={`Remove ${content}`}
    data-testid={`Remove ${content}`}
    onClick={handleClick}
  >
    <FontAwesomeIcon className="trash-icon" icon={faTrashAlt} />
  </button>
)

RemoveButton.propTypes = {
  content: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default RemoveButton
