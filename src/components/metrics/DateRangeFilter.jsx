// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"

// 30 days ago
export const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10)
// Today
export const defaultEndDate = new Date().toISOString().slice(0, 10)

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
      <div className="row gy-1">
        <label htmlFor="startDate" className="col-sm-3 col-form-label py-1">
          Start
        </label>
        <div className="col-sm-5 my-0">
          <input
            type="date"
            className="form-control-plaintext py-0"
            id="startDate"
            value={params.startDate}
            onChange={handleStartDateChange}
          />
        </div>
      </div>
      <div className="row gy-1">
        <label htmlFor="endDate" className="col-sm-3 col-form-label py-1">
          End
        </label>
        <div className="col-sm-5 my-0">
          <input
            type="date"
            className="form-control-plaintext py-0"
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
