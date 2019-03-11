// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import HomePage from './HomePage'
import '../styles/main.css'
import Editor from './editor/Editor'
import Footer from './Footer'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import ImportResourceTemplate from './editor/ImportResourceTemplate'
import Browse from './editor/Browse'
import Login from './Login'
import { loadState } from '../localStorage'

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
    const user = loadState('jwtAuth')

    const PrivateRoute = ({ component: ImportResourceTemplate, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          (user !== undefined && user.isAuthenticated) ? (
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
          <Route path="/login" render={(props)=><Login {...props} location={{state: { from: props.location }}}/>} />
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

export default withRouter(connect(mapStateToProps, null)(App))
