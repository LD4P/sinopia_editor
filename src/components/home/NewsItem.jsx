// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h3>Latest news</h3>
    <h4>Sinopia Version {version} highlights</h4>
    <p><i>For complete release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.</i></p>
    <ul>
      <li>Sinopia API allows external systems to request data, including query by date and type</li>
      <li>Vocabulary of Sinopia-specific classes and properties published</li>
      <li>Modal lookups make it easier to see context for external authorities</li>
    </ul>
  </div>
)

export default NewsItem
