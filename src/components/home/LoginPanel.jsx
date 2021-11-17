import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { hasUser as hasUserSelector } from "selectors/authenticate"
import { signIn } from "actionCreators/authenticate"
import Config from "Config"
import { selectErrors } from "selectors/errors"
import _ from "lodash"
import { signInErrorKey } from "utilities/errorKeyFactory"

const LoginPanel = () => {
  const dispatch = useDispatch()
  const hasUser = useSelector((state) => hasUserSelector(state))

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const error = _.first(
    useSelector((state) => selectErrors(state, signInErrorKey))
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(signIn(username, password, signInErrorKey))
  }

  if (hasUser) return null

  return (
    <React.Fragment>
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
        </div>
      )}
      <form className="login-form" onSubmit={(event) => handleSubmit(event)}>
        <h4>Login to the Linked Data Editor</h4>
        <div className="row mb-2">
          <label htmlFor="username" className="col-sm-3 col-form-label">
            User name
          </label>
          <div className="col-sm-9">
            <input
              id="username"
              name="username"
              type="text"
              className="form-control"
              placeholder=""
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            ></input>
          </div>
        </div>
        <div className="row">
          <label
            htmlFor="password"
            style={{ wordWrap: "normal" }}
            className="col-sm-3 col-form-label"
          >
            Password
          </label>

          <div className="col-sm-9">
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder=""
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            ></input>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            <button className="btn btn-block btn-primary" type="submit">
              Login
            </button>
          </div>
          <div className="col-sm-9">
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
