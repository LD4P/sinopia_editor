// Copyright 2019 Stanford University see LICENSE for license

import { clearingResourceURIMessage } from 'actions/index'

const clearResourceURIMessage = () => (dispatch, getState) => {
  if (getState().selectorReducer.editor.resourceURIMessage.show === false) {
    return // The resource URI message is already clear
  }

  dispatch(clearingResourceURIMessage())
}

export default clearResourceURIMessage
