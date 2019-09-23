// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item">
    <h1>Announcing Sinopia Version 1.0.2</h1>
    <ul>
      <li>Version 1.0.2 fixes the bugs with lookups and defaults in nested templates.
      </li>
      <li>For complete {version} release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.
      </li>
    </ul>
  </div>
)

export default NewsItem
