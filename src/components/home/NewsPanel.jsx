// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import NewsItem from './NewsItem'

class NewsPanel extends Component {
  render() {
    return (
      <div className="jumbotron banner center-block">
        <div className="panel panel-news">
          <div className="panel-body">
            <div className="row">
              <div className="col-md-17">
                <NewsItem />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default NewsPanel
