// Copyright 2019 Stanford University see LICENSE for license

import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import { selectGroupMap } from "selectors/groups"
import _ from "lodash"

export const defaultGroup = null

const GroupFilter = ({ params, setParams }) => {
  const groupMap = useSelector((state) => selectGroupMap(state))

  const groupOptions = useMemo(
    () =>
      _.sortBy(Object.entries(groupMap), (entry) => entry[1]).map(
        ([group, label]) => (
          <option key={group} value={group}>
            {label}
          </option>
        )
      ),
    [groupMap]
  )

  const handleGroupChange = (event) => {
    setParams({
      ...params,
      group: event.target.value === "" ? null : event.target.value,
    })

    event.preventDefault()
  }

  return (
    <React.Fragment>
      <div className="row">
        <label htmlFor="group" className="col-sm-3 col-form-label">
          Group
        </label>
        <div className="col-sm-8">
          <select
            className="form-select"
            id="group"
            aria-label="Select group"
            value={params.group || ""}
            onChange={handleGroupChange}
            onBlur={handleGroupChange}
          >
            <option key="all" value="">
              All
            </option>
            {groupOptions}
          </select>
        </div>
      </div>
    </React.Fragment>
  )
}

GroupFilter.propTypes = {
  params: PropTypes.object.isRequired,
  setParams: PropTypes.func.isRequired,
}

export default GroupFilter
