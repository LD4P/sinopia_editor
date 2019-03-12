// Copyright 2018 Stanford Junior University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import NewsItem from './NewsItem.jsx'
import LoginPanel from './LoginPanel.jsx'

class NewsPanel extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return(
      <div className="jumbotron banner center-block">
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="row">
              <div className="col-md-7">
                <NewsItem />
              </div>
              <div className="col-md-4 login-sec">
                <LoginPanel logOut={this.props.logOut} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

NewsPanel.propTypes = {
  jwtAuth: PropTypes.object,
  logOut: PropTypes.func,
  userName: PropTypes.string
}

export default NewsPanel
