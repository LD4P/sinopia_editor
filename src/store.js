import { createStore } from 'redux'
import reducer from './reducers/index'

let store
let initialState = {}
if(process.env.NODE_ENV === "development") {
  store = createStore(reducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
} else {
  store = createStore(reducer, initialState)
}
// To use the redux dev tools chrome extention, replace with:


export default store
