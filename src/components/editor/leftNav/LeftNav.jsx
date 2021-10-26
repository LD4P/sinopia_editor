import React, { useState } from "react"
import PropTypes from "prop-types"
import PanelResourceNav from "./PanelResourceNav"
import Versions from "./Versions"

const LeftNav = ({ resource }) => {
  const [currentTab, setCurrentTab] = useState("nav")

  const handleTabClick = (event, tab) => {
    event.preventDefault()
    setCurrentTab(tab)
  }

  const tabClasses = (tab) => {
    const tabClasses = ["nav-link"]
    if (tab === currentTab) tabClasses.push("active")
    return tabClasses.join(" ")
  }

  if (!resource.uri) {
    return <PanelResourceNav resource={resource} />
  }

  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <React.Fragment>
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
        <li className="nav-item" key="versions">
          <a
            className={tabClasses("versions")}
            href="#"
            onClick={(event) => handleTabClick(event, "versions")}
          >
            Versions
          </a>
        </li>
      </ul>
      {currentTab === "nav" && <PanelResourceNav resource={resource} />}
      {currentTab === "versions" && <Versions resource={resource} />}
    </React.Fragment>
  )
}

LeftNav.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default LeftNav
