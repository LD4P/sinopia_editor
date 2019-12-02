// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h3>Latest news</h3>
    <h4>Sinopia Version {version} highlights</h4>
    <p><i>For complete release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.</i></p>
    <ul>
      <li>On Search tab, filter your Sinopia search results by resource class and by group.</li>
      <li>&quot;Create New&quot; dropdown menu on Sinopia lookup fields displays entire template label and ID.</li>
      <li>In lookup fields with multiple sources, select which of the sources you want results from.</li>
      <li>On Resource Templates tab, page through additional items.</li>
      <li>On Edit tab, number of columns expands as you widen browser.</li>
    </ul>
  </div>
)

export default NewsItem
