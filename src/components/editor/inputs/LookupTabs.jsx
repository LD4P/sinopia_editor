// Copyright 2020 Stanford University see LICENSE for license

import React, { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import LookupTab from "./LookupTab"
import _ from "lodash"
import { getLookupResult } from "utilities/Lookup"

const LookupTabs = (props) => {
  const [currentAuthorityUri, setCurrentAuthorityUri] = useState(
    props.authorityConfigs[0].uri
  )
  const [, setTriggerRender] = useState("")
  // Using a ref so that can append to current list of results.
  const results = useRef({})

  useEffect(() => {
    if (_.isEmpty(props.query)) return

    // Clear the results.
    // No re-render, so change not visible to user.
    props.authorityConfigs.forEach(
      (authorityConfig) => delete results.current[authorityConfig.uri]
    )

    props.authorityConfigs.forEach((authorityConfig) => {
      getLookupResult(props.query, authorityConfig, 0).then((result) => {
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

    getLookupResult(props.query, authorityConfig, newStartOfRange).then(
      (result) => {
        result.options = { startOfRange: newStartOfRange }
        results.current[authorityConfig.uri] = result
        // Changing state triggers re-render.
        setTriggerRender(result)
      }
    )
  }

  const handleTabClick = (event, authorityUri) => {
    setCurrentAuthorityUri(authorityUri)
    event.preventDefault()
  }

  /* eslint-disable jsx-a11y/anchor-is-valid */
  const tabs = props.authorityConfigs.map((authorityConfig) => {
    const totalHits = results.current[authorityConfig.uri]?.totalHits
    const title =
      totalHits !== undefined
        ? `${authorityConfig.label} (${totalHits})`
        : authorityConfig.label
    const tabClasses = ["nav-link"]
    if (currentAuthorityUri === authorityConfig.uri) tabClasses.push("active")
    return (
      <li className="nav-item" key={authorityConfig.uri}>
        <a
          className={tabClasses.join(" ")}
          href="#"
          onClick={(event) => handleTabClick(event, authorityConfig.uri)}
        >
          {title}
        </a>
      </li>
    )
  })
  /* eslint-enable jsx-a11y/anchor-is-valid */

  const authorityConfig = props.authorityConfigs.find(
    (authorityConfig) => authorityConfig.uri === currentAuthorityUri
  )

  return (
    <React.Fragment>
      {tabs.length > 1 && <ul className="nav nav-pills">{tabs}</ul>}
      <LookupTab
        authorityConfig={authorityConfig}
        query={props.query}
        handleUpdateURI={props.handleUpdateURI}
        handleChangePage={handleChangePage}
        result={results.current[currentAuthorityUri]}
      />
    </React.Fragment>
  )
}

LookupTabs.propTypes = {
  authorityConfigs: PropTypes.array.isRequired,
  query: PropTypes.string,
  handleUpdateURI: PropTypes.func.isRequired,
}

export default LookupTabs
