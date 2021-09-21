// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import {
  selectHistoricalTemplates,
  selectHistoricalSearches,
  selectHistoricalResources,
} from "selectors/history"
import Header from "../Header"
import ResourceList from "./ResourceList"
import ResourceTemplateSearchResult from "../templates/ResourceTemplateSearchResult"
import SearchList from "./SearchList"
import Alerts from "../Alerts"
import _ from "lodash"
import useResource from "hooks/useResource"

export const dashboardErrorKey = "dashboard"

const Dashboard = (props) => {
  const historicalTemplates = useSelector((state) =>
    selectHistoricalTemplates(state)
  )
  const historicalSearches = useSelector((state) =>
    selectHistoricalSearches(state)
  )
  const historicalResources = useSelector((state) =>
    selectHistoricalResources(state)
  )
  const { handleNew, handleCopy, handleEdit } = useResource(dashboardErrorKey)

  const showWelcome =
    _.isEmpty(historicalTemplates) &&
    _.isEmpty(historicalSearches) &&
    _.isEmpty(historicalResources)

  return (
    <section id="dashboard">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <Alerts errorKey={dashboardErrorKey} />
      {showWelcome && (
        <div>
          <h2>Welcome to Sinopia.</h2>
          <p>
            As you use Sinopia, your most recently used templates, resources,
            and searches will appear on this dashboard.
          </p>
        </div>
      )}
      {!_.isEmpty(historicalTemplates) && (
        <div>
          <h2>Recent templates</h2>
          <ResourceTemplateSearchResult
            results={historicalTemplates}
            handleClick={handleNew}
            handleEdit={handleEdit}
            handleCopy={handleCopy}
          />
        </div>
      )}
      {!_.isEmpty(historicalSearches) && (
        <div>
          <h2>Recent searches</h2>
          <SearchList searches={historicalSearches} />
        </div>
      )}
      {!_.isEmpty(historicalResources) && (
        <div>
          <h2>Recent resources</h2>
          <ResourceList resources={historicalResources} />
        </div>
      )}
    </section>
  )
}

Dashboard.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default Dashboard
