import { combineReducers } from 'redux'
import literal from './literal'
import lookups from './lookups'
import { generateRDF } from './rdf'
import lang from './lang'

export default combineReducers({
  literal,
  lookups,
  generateRDF,
  lang
})
