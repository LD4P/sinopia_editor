import { createStore } from 'redux'
import reducer from './reducers/literal'

const store = createStore(reducer)

export default store
