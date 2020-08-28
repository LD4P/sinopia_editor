// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h3>Latest news</h3>
    <h4>Sinopia Version {version} highlights</h4>
    <p><i>For complete release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.</i></p>
    <ul>
      <li>Resource Templates are now expressed in RDF and handled as Resources, so
        they can be created and changed within the Sinopia Editor</li>
      <li>Sinopia now uses MongoDB replacing Trellis to store and manage
        resources</li>
    </ul>
  </div>
)

export default NewsItem
