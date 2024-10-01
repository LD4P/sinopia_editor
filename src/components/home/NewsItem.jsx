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
        <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release">
          Sinopia help site
        </a>
        .
      </i>
    </p>
    <ul>
      <li>Cached-lookups replaced with provider APIs for QA</li>
      <li>New autofill for Work title when creating a Work from an Instance</li>
      <li>
        New vocabularies added for relationship, note type, and serial
        publication type
      </li>
      <li>Updates to BF2MARC conversion</li>
      <li>UI/UX updates</li>
    </ul>
  </div>
)

export default NewsItem
