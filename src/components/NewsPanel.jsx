// Copyright 2018 Stanford Junior University see Apache2.txt for license

import React, {Component} from 'react'
import NewsItem from './NewsItem'

class NewsPanel extends Component {
  constructor(props) {
    super(props)
  }

  render(){

    return(
      <div className="jumbotron banner center-block">
        <div className="panel panel-news">
          <div className="panel-body">
            <div className="row">
              <div className="col-md-7">
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
