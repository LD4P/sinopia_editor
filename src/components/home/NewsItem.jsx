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
      <li>
        Language tagging improvements: use of IANA Registry, addition of script
        and transliteration tags
      </li>
      <li>
        Multiple nested resource fields permitted to use same property as long
        as the nested resources are of different classes
      </li>
      <li>Fields can be configured to allow choice of property</li>
    </ul>
  </div>
)

export default NewsItem
