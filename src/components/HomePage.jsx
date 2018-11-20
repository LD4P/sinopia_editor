// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import NewsPanel from './NewsPanel'
import DescPanel from './DescPanel'

class HomePage extends Component {
  render() {
    return(
      <div id="home-page">
        <Header triggerHomePageMenu={this.props.triggerHandleOffsetMenu} />
        <NewsPanel />
        <DescPanel />
      </div>
    )
  }
}

HomePage.propTypes = {
  // Passed through ...Props
  children: PropTypes.array,
  triggerHandleOffsetMenu: PropTypes.func
}

export default HomePage
