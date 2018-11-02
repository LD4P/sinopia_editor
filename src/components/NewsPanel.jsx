import React from 'react';
import LoginPanel from './LoginPanel.jsx'

const NewsPanel = () => (
  <div className="jumbotron banner center-block">
    <div className="panel panel-default">
      <div className="panel-body">
        <div className="row">
          <div className="col-md-7">
            <h1> Latest News </h1>
            <ul>
            <li>We are looking for a Wikipedian in residence to join our team and boost our productivity. Send applications to hiring at dlss dot com.</li>
            <p></p>
            <li>We hit our January milestone and pushed the latest code to production. Try these new features and provide feedback to the Google group.</li>
            </ul>
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