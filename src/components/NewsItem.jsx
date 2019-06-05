// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'

const NewsItem = () => (
  <div className="news-item">
    <h1> What&#8217;s New </h1>
    <ul>
      <li>Release 0.3.0 is live, including these features</li>
      <ul>
        <li>User login.
        </li>
        <li>Adding and updating Resource Templates.
        </li>
        <li>Opening Resource Templates to see how they behave in cataloging.
        </li>
      </ul>
      <li>For release notes and the latest point releases, see the <a href="https://github.com/LD4P/sinopia/wiki/">Sinopia help site</a>.
      </li>
    </ul>
  </div>
)

export default NewsItem
