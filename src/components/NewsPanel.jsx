/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
import React from 'react'
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

)

export default NewsPanel
