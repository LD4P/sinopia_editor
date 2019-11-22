// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import NewsItem from './NewsItem'
import LoginPanel from './LoginPanel'
import CognitoUtils from '../../CognitoUtils'
import { getAuthenticationError, getCurrentSession, getCurrentUser } from '../../authSelectors'

class NewsPanel extends Component {

  render() {
    const currentUser = this.props.currentUser || CognitoUtils.cognitoUserPool().getCurrentUser()

    const loggedInPanel = (
      <React.Fragment>
         <div className="col-md-12">
          <NewsItem /><LoginPanel />
         </div>
      </React.Fragment>
    )

    const notLoggedInPanel = (
      <React.Fragment>
        <div className="col-md-6">
           <NewsItem />
        </div>
        <div className="col-md-6">
           <LoginPanel />
        </div>
      </React.Fragment>
    )

    return (
      <div className="jumbotron banner center-block">
        <div className="card panel-news">
          <div className="card-body">
            <div className="row">
              { currentUser ? loggedInPanel : notLoggedInPanel }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NewsPanel
