// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item">
    <h1> What&#8217;s New </h1>
    <ul>
      <li>Release {version} is live, including these features</li>
      <ul>
        <li>New component for linking to Sinopia created entities.
        </li>
        <li>Input Lookup components allow users to enter a URI if not found in the lookup
        </li>
        <li>Validation of embedded Resource Templates
        </li>
        <li>Numerous bug fixes and test improvements</li>
      </ul>
      <li>For release notes and the latest point releases, see the <a href="https://github.com/LD4P/sinopia/wiki/">Sinopia help site</a>.
      </li>
    </ul>
  </div>
)

export default NewsItem
