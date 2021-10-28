import React, { useState } from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import PanelResourceNav from "./PanelResourceNav"
import Versions from "./Versions"
import Relationships from "./Relationships"
import { hasRelationships as hasRelationshipsSelector } from "selectors/relationships"

const LeftNav = ({ resource }) => {
  const [currentTab, setCurrentTab] = useState("nav")
  const hasRelationships = useSelector((state) =>
    hasRelationshipsSelector(state, resource.key)
  )

  const handleTabClick = (event, tab) => {
    event.preventDefault()
    setCurrentTab(tab)
  }

  const tabClasses = (tab) => {
    const tabClasses = ["nav-link"]
    if (tab === currentTab) tabClasses.push("active")
    return tabClasses.join(" ")
  }

  let pills = null
  if (resource.uri)
    /* eslint-disable jsx-a11y/anchor-is-valid */
    pills = (
      <ul className="nav nav-pills">
        <li className="nav-item" key="nav">
          <a
            className={tabClasses("nav")}
            href="#"
            onClick={(event) => handleTabClick(event, "nav")}
          >
            Navigation
          </a>
        </li>
        {resource.uri && (
          <li className="nav-item" key="versions">
            <a
              className={tabClasses("versions")}
              href="#"
              onClick={(event) => handleTabClick(event, "versions")}
            >
              Versions
            </a>
          </li>
        )}
        {hasRelationships && (
          <li className="nav-item" key="relationships">
            <a
              className={tabClasses("relationships")}
              href="#"
              onClick={(event) => handleTabClick(event, "relationships")}
            >
              Relationships
            </a>
          </li>
        )}
      </ul>
    )

  return (
    <React.Fragment>
      {pills}
      <div className="col-md-5 col-lg-4 col-xl-3 left-nav">
        {currentTab === "nav" && <PanelResourceNav resource={resource} />}
        {currentTab === "versions" && <Versions resource={resource} />}
        {currentTab === "relationships" && (
          <Relationships resourceKey={resource.key} />
        )}
      </div>
    </React.Fragment>
  )
}

LeftNav.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default LeftNav
