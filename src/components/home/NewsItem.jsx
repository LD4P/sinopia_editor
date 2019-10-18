// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item">
    <h1>Sinopia Version {version} released with new features and bug fixes!</h1>
    <ul>
      <li>Friendlier preview: choice of table, N-triples ot Turtle.</li>
      <li>"Copy URI" button to copy a URI as soon as a Resource is saved.</li>
      <li>Ability to search indexed Resources by Resource URI.</li>
      <li>Search finds matching strings with and without diacritics.</li>
      <li>Visual indication of which environment you are in (development, stage, production).</li>
      <li>Fixed bug where nested Resource Templates with property type resource (not pointing to Resource Templates, but instead expecting a URI) did not work.</li>
      <li>Fixed bug related to loading triples.</li>
      <li>For complete {version} release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.
      </li>
    </ul>
  </div>
)

export default NewsItem
