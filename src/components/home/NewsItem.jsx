// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item">
    <h1>Sinopia Version {version} is live</h1>
    <ul>
      <li>Support for deriving new descriptions from external data and from Sinopia resources
      </li>
      <li>Improvements to Load RDF feature</li>
      <li>For complete {version} release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.
      </li>
    </ul>
  </div>
)

export default NewsItem
