// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons"

const ToggleButton = ({
  handleClick,
  isExpanded,
  label,
  isDisabled = false,
}) => (
  <button
    type="button"
    className="btn btn-toggle align-baseline"
    disabled={isDisabled}
    aria-label={label}
    data-testid={label}
    aria-expanded={isExpanded ? "true" : "false"}
    onClick={handleClick}
  >
    <FontAwesomeIcon
      className="toggle-icon"
      icon={isExpanded ? faAngleDown : faAngleRight}
    />
  </button>
)

ToggleButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
}

export default ToggleButton
