// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item">
    <h1> What&#8217;s New </h1>
    <ul>
      <li>Release {version} is live, including these features:</li>
      <ul>
        <li>List of Available Resource Templates has additional columns and sorts automatically</li>
        <li>You can now enter URIs and literals in lookup fields</li>
        <li>Editor validates whether mandatory fields are filled in within nested Resource Templates</li>
        <li>Improved validation and display of validation errors</li>
        <li>Editor provides confirmation message including newly minted URI when you click Save</li>
        <li>New Load RDF feature</li>
      </ul>
      <li>For complete release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.
      </li>
    </ul>
  </div>
)

export default NewsItem
