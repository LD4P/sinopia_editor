// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h1>Sinopia Version {version}: new feature highlights.</h1>
    <p><i>For complete release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.</i></p>
    <ul>
      <li>Sinopia search results include type, group, and date modified.</li>
      <li>All Sinopia resources are now searchable, and all literal fields are searchable.</li>
      <li>Resource Templates accessible by unique URL for bookmarking and sharing.</li>
      <li>Import accepts a Resource Template file.</li>
      <li>Search and copy DISCOGS data.</li>
      <li>Download full exports of Sinopia data.</li>
    </ul>
  </div>
)

export default NewsItem
