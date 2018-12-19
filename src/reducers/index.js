import { combineReducers } from 'redux'
import literal from './literal'
import lookups from './lookups'

export default combineReducers({
  literal, lookups
})