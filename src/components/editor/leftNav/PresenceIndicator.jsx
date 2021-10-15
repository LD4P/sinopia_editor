import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons"
import _ from "lodash"

const PresenceIndicator = (props) => {
  if (_.isEmpty(props.valueKeys)) return null

  return (
    <span className="align-text-bottom">
      <FontAwesomeIcon icon={faCircle} size="xs" />
    </span>
  )
}

PresenceIndicator.propTypes = {
  valueKeys: PropTypes.array.isRequired,
}

export default PresenceIndicator
