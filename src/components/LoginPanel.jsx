// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react'

// TODO: This will need to be re-written in the correct "react" way.
const LoginPanel = () => (
  <form className="login-form">
    <div className = "form-group">
      <label htmlFor="exampleInputEmail1" className="text-uppercase">Username</label>
      <input type="text" className="form-control" placeholder=""></input>
    </div>
    <div className="form-group">
      <label htmlFor="exampleInputPassword1" className="text-uppercase">Password</label>
      <input type="password" className="form-control" placeholder=""></input>
    </div>
    <div className="row">
      <div className="col-xs-6">
        <button className="btn btn-block btn-primary" type="submit">Login</button>
      </div>
      <div className="col-xs-6">
        <a href="#"><small>Forgot Password</small></a>
        <br></br>
        <a href="#"><small>Request Account</small></a>
      </div>
    </div>
  </form>
)

export default LoginPanel
