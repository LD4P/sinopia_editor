import Config from 'Config'
import { addError, clearErrors } from 'actions/errors'
import { exportsReceived } from 'actions/exports'

export const fetchExports = (errorKey) => (dispatch) => {
  dispatch(clearErrors(errorKey))
  // Not using AWS SDK because requires credentials, which is way too much overhead.
  return fetch(Config.exportBucketUrl)
    .then((response) => response.text())
    .then((str) => (new DOMParser()).parseFromString(str, 'text/xml'))
    .then((data) => {
      const elems = data.getElementsByTagName('Key')
      const keys = []
      for (let i = 0; i < elems.length; i++) {
        keys.push(elems.item(i).innerHTML)
      }
      dispatch(exportsReceived(keys))
    })
    .catch((err) => dispatch(addError(errorKey, `Error retrieving list of exports: ${err.message}`)))
}

export const noop = () => {}
