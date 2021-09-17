// Copyright 2020 Stanford University see LICENSE for license

import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import Tab from '../Tab'
import Tabs from '../Tabs'
import LookupTab from './LookupTab'
import _ from 'lodash'
import { getLookupResult } from 'utilities/Lookup'

const LookupTabs = (props) => {
  const [tabKey, setTabKey] = useState()
  const [, setTriggerRender] = useState('')
  // Using a ref so that can append to current list of results.
  const results = useRef({})

  useEffect(() => {
    if (_.isEmpty(props.query)) return

    // Clear the results.
    // No re-render, so change not visible to user.
    props.authorityConfigs.forEach((authorityConfig) => delete results.current[authorityConfig.uri])

    props.authorityConfigs.forEach((authorityConfig) => {
      getLookupResult(props.query, authorityConfig, 0)
        .then((result) => {
          result.options = { startOfRange: 0 }
          results.current[authorityConfig.uri] = result
          // Changing state triggers re-render.
          setTriggerRender(result)
        })
    })
  }, [props.query, props.authorityConfigs])

  const handleChangePage = (newStartOfRange, authorityConfig) => {
    // Clear the results.
    // No re-render, so change not visible to user.
    delete results.current[authorityConfig.uri]

    getLookupResult(props.query, authorityConfig, newStartOfRange)
      .then((result) => {
        result.options = { startOfRange: newStartOfRange }
        results.current[authorityConfig.uri] = result
        // Changing state triggers re-render.
        setTriggerRender(result)
      })
  }

  const tabs = props.authorityConfigs.map((authorityConfig) => {
    const totalHits = results.current[authorityConfig.uri]?.totalHits
    const title = totalHits !== undefined ? `${authorityConfig.label} (${totalHits})` : authorityConfig.label
    return (
      <Tab key={authorityConfig.uri} eventKey={authorityConfig.uri} title={title}>
        <LookupTab
            authorityConfig={authorityConfig}
            query={props.query}
            handleSelectionChanged={ props.handleSelectionChanged }
            handleChangePage={handleChangePage}
            result={results.current[authorityConfig.uri]} />
      </Tab>
    )
  })

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
