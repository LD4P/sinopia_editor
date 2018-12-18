import { combineReducers } from 'redux'
import literal from './literal'
import list from './list'

export default combineReducers({
  literal, list
})