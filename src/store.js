import { createStore } from 'redux'
import reducer from './reducers/index'
import Config from './Config'

let initialState = {}
if(process.env.NODE_ENV === "development") {
  initialState = {
    authenticate: {
      loginJwt: {
        id_token: Config.awsCognitoIdToken,
        access_token: Config.awsCognitoAccessToken,
        username: 'test-user',
        isAuthenticated: true,
        expiry: 5555555555555
    }}
  }
}

const store = createStore(reducer, initialState)

// To use the redux dev tools chrome extention, replace with:
// const store = createStore(reducer,
//   initialState,
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// )

export default store
