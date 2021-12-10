// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { formatISODate } from "utilities/Utilities"

// 30 days ago
export const defaultStartDate = formatISODate(
  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
)
// Today
export const defaultEndDate = formatISODate(new Date())

const DateRangeFilter = ({ params, setParams }) => {
  const handleStartDateChange = (event) => {
    setParams({
      ...params,
      startDate:
        event.target.value === "" ? defaultStartDate : event.target.value,
    })
    event.preventDefault()
  }

  const handleEndDateChange = (event) => {
    setParams({
      ...params,
      endDate: event.target.value === "" ? defaultEndDate : event.target.value,
    })
    event.preventDefault()
  }

  return (
    <React.Fragment>
      <div className="row">
        <label htmlFor="startDate" className="col-sm-3 col-form-label">
          Start
        </label>
        <div className="col-sm-5">
          <input
            type="date"
            className="form-control-plaintext"
            id="startDate"
            value={params.startDate}
            onChange={handleStartDateChange}
          />
        </div>
      </div>
      <div className="row">
        <label htmlFor="endDate" className="col-sm-3 col-form-label">
          End
        </label>
        <div className="col-sm-5">
          <input
            type="date"
            className="form-control-plaintext"
            id="endDate"
            value={params.endDate}
            onChange={handleEndDateChange}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

DateRangeFilter.propTypes = {
  params: PropTypes.object.isRequired,
  setParams: PropTypes.func.isRequired,
}

export default DateRangeFilter
