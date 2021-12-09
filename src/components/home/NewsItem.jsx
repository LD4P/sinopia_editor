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
      <li>Language detection and suggestion</li>
      <li>Sinopia/Symphony integration for Stanford users</li>
      <li>Templates are included in Sinopia search</li>
      <li>Can set literal field to default to current date or userID</li>
    </ul>
  </div>
)

export default NewsItem
