// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import Header from "./Header"
import NewsPanel from "./NewsPanel"
import DescPanel from "./DescPanel"

const HomePage = (props) => (
  <div id="home-page">
    <Header triggerHomePageMenu={props.triggerHandleOffsetMenu} />
    <NewsPanel />
    <DescPanel />
  </div>
)

HomePage.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default HomePage
