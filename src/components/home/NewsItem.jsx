// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item">
    <h1> Announcing Sinopia Version 1.0</h1>
    <ul>
      <li>New in this release</li>
      <ul>
        <li>Search for descriptions created in Sinopia</li>
        <li>Edit previously created descriptions</li>
        <li>Look up and refer to Sinopia-created entities and to entities from Share-VDE datasets (as they become available)</li>
        <li>Better messaging when a resource template is not configured as expected</li>
      </ul>
      <li>For complete {version} release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.
      </li>
      <li>Version 1.0.1: adds support for lookups to Share-VDE data
      </li> 
    </ul>
  </div>
)

export default NewsItem
