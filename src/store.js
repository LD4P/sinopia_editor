import { createStore } from 'redux'
import reducer from './reducers/index'

const store = createStore(reducer)

// To use the redux dev tools chrome extention, replace with:
// const store = createStore(reducer,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store
