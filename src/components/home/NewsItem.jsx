// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h3>Sinopia Version {version}: new features and bug fixes</h3>
    <p><i>For complete release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.</i></p>
    <ul>
      <li>Labels for items selected from lookups are indexed and searchable.</li>
      <li>On fields that are lookups to Sinopia BIBFRAME Instances or BIBFRAME Works, a &quot;Create New&quot;
        link offers a quick way to open relevant Resource Templates,
        to create a new Work or Instance if the one you want does not exist.</li>
      <li>Language selection for literal values uses ISO 639-2 and offers additional &quot;no language specified&quot; choice.</li>
      <li>Extended context displayed in Search tab results for external sources (QA searches).</li>
      <li>Wikidata available as a lookup source.</li>
      <li>Bug fixes including</li>
      <ul>
        <li>Language of literal restored to table preview.</li>
        <li>Sort order retained when paging through results.</li>
        <li>Editing previously seleted language tag on literal applies to correct literal.</li>
      </ul>
      <li>UX enhancements including</li>
      <ul>
        <li>Better visiblity of error message upon opening a Resource Template.</li>
        <li>Modified date for search results displayed as absolute date.</li>
        <li>Page header redesigned to save space.</li>
        <li>Several improvements to look and consistency of buttons, links, and headers.</li>
      </ul>
    </ul>
  </div>
)

export default NewsItem
