// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import HomePage from './HomePage'
import '../styles/main.css'
import Editor from './editor/Editor'
import Footer from './Footer'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { logIn } from '../actions/index'
import ImportResourceTemplate from './editor/ImportResourceTemplate'
import Browse from './editor/Browse'
import Login from './Login'

const FourOhFour = () => <h1>404</h1>

class App extends Component{
  constructor(props) {
    super(props)
    this.state = {
      redirectToReferrer: false,
      isMenuOpened: false
    }
  }

  render() {
    const PrivateRoute = ({ component: ImportResourceTemplate, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          this.props.jwtAuth.isAuthenticated ? (
            <ImportResourceTemplate {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    )

    return(
      <div id="app">
        <Switch>
          <Route exact path='/' render={(props)=><HomePage {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <Route exact path='/editor' render={(props)=><Editor {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <PrivateRoute exact path='/import' component={(props)=><ImportResourceTemplate {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />}/>
          <Route exact path='/browse' render={(props)=><Browse {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <Route path="/login" render={(props)=><Login {...props} />} />
          <Route id="404" component={FourOhFour} />
        </Switch>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    jwtAuth: state.authenticate.loginJwt
  }
}

const mapDispatchToProps = dispatch => ({
  authenticate(jwt){
    dispatch(logIn(jwt))
  }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
