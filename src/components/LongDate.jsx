// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"

const LongDate = (props) => {
  const date = new Date(props.datetime)
  if (!props.datetime || !date || !date.getTime || Number.isNaN(date.getTime()))
    return null
  const options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: props.timeZone,
  }
  const long = date.toLocaleString("default", options)
  return (
    <time title={props.datetime} dateTime={props.datetime}>
      {long}
    </time>
  )
}

LongDate.propTypes = {
  datetime: PropTypes.string,
  timeZone: PropTypes.string,
}
export default LongDate
