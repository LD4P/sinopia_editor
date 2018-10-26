import React from 'react';

// TODO: This will need to be re-written in the correct "react" way.
const LoginPanel = () => (
  <form class="login-form">
    <div class = "form-group">
      <label for="exampleInputEmail1" class="text-uppercase">Username</label>
      <input type="text" class="form-control" placeholder=""></input>
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1" class="text-uppercase">Password</label>
      <input type="password" class="form-control" placeholder=""></input>
    </div>
    <div class="row">
      <div class="col-xs-6">
        <button class="btn btn-block btn-primary" type="submit">Login</button>
      </div>
      <div class="col-xs-6">
        <a href="#"><small>Forgot Password</small></a>
        <br></br>
        <a href="#"><small>Request Account</small></a>
      </div>
    </div>
  </form>
);

export default LoginPanel;