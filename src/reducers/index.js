import { combineReducers } from 'redux'
import literal from './literal'
import lookups from './lookups'
import { generateLD } from './linkedData'

export default combineReducers({
  literal,
  lookups,
  generateLD
})
