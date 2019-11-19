// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import CopyToNewButton from './actions/CopyToNewButton'
import PreviewButton from './actions/PreviewButton'
import CloseButton from './actions/CloseButton'
import SaveAndPublishButton from './actions/SaveAndPublishButton'

const EditorActions = () => (
  <div className="row">
    <section className="col-md-4 offset-md-8 text-right">
      <CopyToNewButton />
      <PreviewButton />
      <CloseButton />
      <SaveAndPublishButton class="editor-save" />
    </section>
  </div>
)

export default EditorActions
