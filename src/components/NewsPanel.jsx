import React from 'react';
import NewsItem from './NewsItem.jsx'
import LoginPanel from './LoginPanel.jsx'

const NewsPanel = () => (
  <div className="jumbotron banner center-block">
    <div className="panel panel-default">
      <div className="panel-body">
        <div className="row">
          <div className="col-md-7">
            <NewsItem />
          </div>
          <div className="col-md-4 login-sec">
            <LoginPanel />
          </div>
        </div>
      </div>
    </div>
  </div>

);

export default NewsPanel;