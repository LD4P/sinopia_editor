// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import CopyToNewButton from './actions/CopyToNewButton'
import PreviewButton from './actions/PreviewButton'
import CloseButton from './actions/CloseButton'
import SaveAndPublishButton from './actions/SaveAndPublishButton'
import MarcButton from './actions/MarcButton'

const EditorActions = () => (
  <div className="row">
    <div className="col-md-5 offset-md-7 text-right">
      <div style={{ display: 'inline-flex' }}>
        <MarcButton />
        <CopyToNewButton />
        <PreviewButton />
        <CloseButton />
        <SaveAndPublishButton class="editor-save" />
      </div>
    </div>
  </div>
)

export default EditorActions
