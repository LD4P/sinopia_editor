// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item">
    <h1>Sinopia Version {version} fixes critical bugs</h1>
    <ul>
      <li>From Search tab when you try to open a Resource created with a Resource
        Template that no longer exists, you will get a message explaining why the Resource cannot be opened.
      </li>
      <li>From Resource Template tab, Sinopia now checks for problems with a Resource Template before opening,
        and reports those problems, including: nesting another Resource Template that does not exist, or referring to a lookup source that is not supported.
      </li>
      <li>Fixes issue where Resources were not getting saved.</li>
      <li>New feature: Lookup fields now support having multiple sources that are direct lookups to id.loc.gov.</li>
      <li>For complete {version} release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.
      </li>
    </ul>
  </div>
)

export default NewsItem
