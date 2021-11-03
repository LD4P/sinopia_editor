// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import Package from "../../../package.json"

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h3>Latest news</h3>
    <h4>Sinopia Version {Package.version} highlights</h4>
    <p>
      <i>
        For complete release notes see the{" "}
        <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">
          Sinopia help site
        </a>
        .
      </i>
    </p>
    <ul>
      <li>Resource versions and display of differences</li>
      <li>URLs for bookmarking and sharing resources</li>
      <li>BIBFRAME relationships displayed</li>
      <li>Editor layout improvements</li>
      <li>Improved tooltips (remarks) for templates</li>
    </ul>
  </div>
)

export default NewsItem
