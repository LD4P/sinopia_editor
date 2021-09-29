import React from "react"
import PropTypes from "prop-types"

const DiacriticsButton = ({ id, content, handleClick, handleBlur }) => (
  <button
    className="btn btn-link fs-4 py-0"
    id={id}
    aria-label={`Select diacritics for ${content}`}
    data-testid={`Select diacritics for ${content}`}
    onClick={handleClick}
    onBlur={handleBlur}
  >
    &auml;
  </button>
)

DiacriticsButton.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
}

export default DiacriticsButton
