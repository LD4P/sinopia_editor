// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import Package from '../../../package.json'

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h3>Latest news</h3>
    <h4>Sinopia Version {Package.version} highlights</h4>
    <p><i>For complete release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.</i></p>
    <ul>
      <li>Dashboard includes records user worked on recently</li>
      <li>Lookup enhancements: faster lookups; ability to page more results; ability to use diacritics in search string; result counts; dropdown lists sorted</li>
      <li>Template creation enhancements: when nesting a template, choose from menu of existing templates;
        when adding lookups, choose from menu of available lookups</li>
    </ul>
  </div>
)

export default NewsItem
