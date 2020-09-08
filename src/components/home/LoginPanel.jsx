import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { hasUser as hasUserSelector } from 'selectors/authenticate'
import { signIn } from 'actionCreators/authenticate'
import Config from 'Config'
import { selectErrors } from 'selectors/errors'
import _ from 'lodash'

export const signInErrorKey = 'signin'

const LoginPanel = () => {
  const dispatch = useDispatch()
  const hasUser = useSelector((state) => hasUserSelector(state))

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const error = _.first(useSelector((state) => selectErrors(state, signInErrorKey)))

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(signIn(username, password, signInErrorKey))
  }

  if (hasUser) return null

  return (
    <React.Fragment>
      { error && <div className="alert alert-danger alert-dismissible" role="alert">{ error }</div> }
      <form className="login-form" onSubmit={(event) => handleSubmit(event)}>
        <h4>Login to the Linked Data Editor</h4>
        <div className = "form-group">
          <label htmlFor="username">
            User name
            <input id="username"
                   style={ { width: '300px' } }
                   name="username"
                   type="text"
                   className="form-control"
                   placeholder=""
                   value={username}
                   onChange={(event) => setUsername(event.target.value)}></input>
          </label>
        </div>
        <div className = "form-group">
          <label htmlFor="password">
            Password
            <input id="password"
                   style={ { width: '300px' } }
                   name="password"
                   type="password"
                   className="form-control"
                   placeholder=""
                   value={password}
                   onChange={(event) => setPassword(event.target.value)}></input>
          </label>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <button className="btn btn-block btn-primary" type="submit">Login</button>
          </div>
          <div className="col-sm-4">
            <div className="row">
              <a href={Config.awsCognitoForgotPasswordUrl}>Forgot Password</a>
            </div>
            <div className="row">
              <a href={Config.awsCognitoResetPasswordUrl}>Request Account</a>
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  )
}

export default LoginPanel
