import { postTransfer } from "../sinopiaApi"
import { addError } from "actions/errors"

export const transfer =
  (resourceUri, group, target, errorKey) => (dispatch) => {
    postTransfer(resourceUri, group, target).catch((err) => {
      dispatch(
        addError(errorKey, `Error requesting transfer: ${err.message || err}`)
      )
    })
  }

export const noop = () => {}
