// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h3>Latest news</h3>
    <h4>Sinopia Version {version} highlights</h4>
    <p><i>For complete release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.</i></p>
    <ul>
      <li>Component for easier entering of diacritics for literal fields.</li>
      <li>&quot;Create New&quot; dropdown menu on Sinopia lookp fields shows all matching items.</li>
      <li>Images are included in extended context in Search results.</li>
      <li>URI of resource is displayed in Search results for Sinopia and for external sources</li>
    </ul>
  </div>
)

export default NewsItem
