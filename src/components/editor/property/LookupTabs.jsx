// Copyright 2020 Stanford University see LICENSE for license

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Tab from '../Tab'
import Tabs from '../Tabs'
import LookupTab from './LookupTab'

const LookupTabs = (props) => {
  const [tabKey, setTabKey] = useState()

  const tabs = props.authorityConfigs.map((authorityConfig) => (
    <Tab key={authorityConfig.uri} eventKey={authorityConfig.uri} title={authorityConfig.label}>
      <LookupTab
          authorityConfig={authorityConfig}
          query={props.query}
          handleSelectionChanged={ props.handleSelectionChanged } />
    </Tab>
  ))
  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={tabKey}
      onSelect={(k) => setTabKey(k)}
    >
      {tabs}
    </Tabs>
  )
}

LookupTabs.propTypes = {
  authorityConfigs: PropTypes.array.isRequired,
  query: PropTypes.string,
  handleSelectionChanged: PropTypes.func.isRequired,
}

export default LookupTabs
