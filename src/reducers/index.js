import { combineReducers } from 'redux'
import literal from './literal'
import lookups from './lookups'
import { generateLD } from './linkedData'

const appReducer = combineReducers({
  literal,
  lookups,
  generateLD
})

const rootReducer = (state, action) => {
  if (action.type === 'REMOVE_ALL') {
    state = {
      literal: {
        formData: [
          {id: '', items: []}
        ]
      },
      lookups: {
        formData: [
          // if action.payload.items contains items (from defaults)
          // {id: 'http://id.loc.gov/ontologies/bibframe/issuance', items: [ {label: 'single unit', id: "http://id.loc.gov/vocabulary/issuance/mono", uri: 'http://id.loc.gov/vocabulary/issuance/mono'} ]}
          // else :
          {id: '', items: []}
        ]
      },
      generateLD: { jsonld: {}}
    }
  }

  return appReducer(state, action)
}

export default rootReducer