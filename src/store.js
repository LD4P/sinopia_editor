import { createStore } from 'redux'
import reducer from './reducers/index'

const store = createStore(reducer)
  // add the following to createStore if want to use Redux plug in
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store
