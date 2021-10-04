// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import CopyToNewButton from "./actions/CopyToNewButton"
import PreviewButton from "./actions/PreviewButton"
import CloseButton from "./actions/CloseButton"
import SaveAndPublishButton from "./actions/SaveAndPublishButton"
import MarcButton from "./actions/MarcButton"

const EditorActions = () => (
  <div className="row">
    <div className="d-flex justify-content-end">
      <MarcButton />
      <CopyToNewButton />
      <PreviewButton />
      <CloseButton label={"Close"} />
      <SaveAndPublishButton class="editor-save" />
    </div>
  </div>
)

export default EditorActions
