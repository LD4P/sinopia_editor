// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import CloseButton from "./actions/CloseButton"
import SaveAndPublishButton from "./actions/SaveAndPublishButton"
import MarcButton from "./actions/MarcButton"
import TransferButtons from "./actions/TransferButtons"

// CopyToNewButton and PreviewButton are now called from ResourceComponent
const EditorActions = () => (
  <div className="row">
    <div className="d-flex justify-content-end">
      <MarcButton />
      <TransferButtons />
      <CloseButton label={"Close"} />
      <SaveAndPublishButton class="editor-save" />
    </div>
  </div>
)

export default EditorActions
