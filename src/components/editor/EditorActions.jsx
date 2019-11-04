// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import CopyToNewButton from './actions/CopyToNewButton'
import PreviewButton from './actions/PreviewButton'
import SaveAndPublishButton from './actions/SaveAndPublishButton'

const EditorActions = () => {
  return (
    <div className="row">
      <section className="col-md-3 offset-md-9 text-right">
        <CopyToNewButton />
        <PreviewButton />
        <SaveAndPublishButton class="editor-save" />
      </section>
    </div>
  )
}

export default EditorActions
