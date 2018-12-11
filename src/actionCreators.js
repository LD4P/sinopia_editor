import { SET_ITEMS } from './actions'

export function setItems(item) {
  return { type: SET_ITEMS, payload: item }
}
