// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { version } from '../../../package.json'

const NewsItem = () => (
  <div className="news-item" data-testid="news-item">
    <h3>Latest news</h3>
    <h4>Sinopia Version {version} highlights</h4>
    <p><i>For complete release notes see the <a href="https://github.com/LD4P/sinopia/wiki/Latest-Release,-What's-Next">Sinopia help site</a>.</i></p>
    <ul>
      <li><strong>Redesign of Editor tab</strong>: The page where you catalog has a
        new look, inspired by the recent redesign of the Library of Congress BIBFRAME
        Editor. The new navigation bar gives an overview of all fields, lets you
        quickly find and move to any field, shows which fields you`&apos;`ve filled in, and
        shows missing fields upon save.</li>
      <li><strong>RDF-to-MARC Conversion</strong>: For BIBFRAME Instances linked to
        Works, you can convert a Sinopia description to MARC record, view the results,
        and download as MARC binary or text.</li>
      <li><strong>Bugs fixes</strong>: Error when editing a template from the
        Recently Used list, and un-entered values not being saved.</li>
    </ul>
  </div>
)

export default NewsItem
