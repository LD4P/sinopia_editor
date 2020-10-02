// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { selectHistoricalTemplates } from 'selectors/history'
import Header from '../Header'
import ResourceTemplateSearchResult from '../templates/ResourceTemplateSearchResult'
import Alerts from '../Alerts'
import _ from 'lodash'
import useResource from 'hooks/useResource'

export const dashboardErrorKey = 'dashboard'

const Dashboard = (props) => {
  const historicalTemplates = useSelector((state) => selectHistoricalTemplates(state))
  const { handleNew, handleCopy, handleEdit } = useResource(props.history, dashboardErrorKey)

  const showWelcome = _.isEmpty(historicalTemplates)

  return (<section id="dashboard">
    <Header triggerEditorMenu={props.triggerHandleOffsetMenu}/>
    <Alerts errorKey={dashboardErrorKey} />
    { showWelcome
      && <div>
        <h2>Welcome to Sinopia.</h2>
        <p>As you use Sinopia, your most recently used templates, resources, and searches will appear on this dashboard.</p>
      </div>
    }
    { !_.isEmpty(historicalTemplates)
      && <div>
        <h2>Most recently used templates</h2>
        <ResourceTemplateSearchResult results={historicalTemplates} handleClick={handleNew} handleEdit={handleEdit} handleCopy={handleCopy} />
      </div>
    }
  </section>)
}

Dashboard.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  history: PropTypes.object.isRequired,
}

export default Dashboard
