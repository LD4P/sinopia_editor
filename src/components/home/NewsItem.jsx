// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h1>Sinopia Version {version}: new features and bug fixes</h1>
    <p><i>For complete release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.</i></p>
    <ul>
      <li>You can catalog in multiple resource templates at once; each template is opened in a tab within the Editor tab</li>
      <li>On Resource Templates tab, search for templates by id, label, author, or description</li>
      <li>On Resource Templates tab, easy access to most recently used templates for your session</li>
      <li>In Sinopia search results, Modified Date displayed as relative date</li>
      <li>In Profile Editor, limit Sinopia lookups to BIBFRAME Instances or BIBFRAME Works</li>
      <li>In Profile Editor, trash can icon lets you cleanly delete valueDataType</li>
      <li>Error upon opening a Resource Template no longer prevents you from opening a different error-free Resource Template</li>
      <li>When opening an existing description, all fields with data are opened for display</li>
      <li>On Edit tab, Save and Close buttons available from bottom of screen as well as top</li>
      <li>Improved checking for unsupported lookups in Resource Templates</li>
      <li>For values selected from a lookup, labels are saved</li>
      <li>Exports include timestamps when resource was created and modified</li>
    </ul>
  </div>
)

export default NewsItem
