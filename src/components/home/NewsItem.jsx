// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import Package from "../../../package.json"

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h3>Sinopia Version {Package.version} highlights</h3>
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
      <li>Improved input experience for literal, lookup, and URI fields.</li>
    </ul>
  </div>
)

export default NewsItem
