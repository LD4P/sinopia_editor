// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
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
import CanvasMenu from "./CanvasMenu";

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

    const defaultRtId = 'resourceTemplate:bf2:Monograph:Instance'

    return(
      <div id="app">
        <Switch>
          <Route exact path='/' render={(props)=><HomePage {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <Route exact path='/editor' render={(props)=><Editor {...props} resourceTemplateId={defaultRtId} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <PrivateRoute exact path='/templates' component={(props)=><ImportResourceTemplate {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />}/>
          <Route exact path='/browse' render={(props)=><Browse {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <Route path="/login" render={(props)=><Login {...props} location={{state: { from: props.location }}}/>} />
          <Route path="/menu" render={(props)=><CanvasMenu {...props} />} />
          <Route id="404" component={FourOhFour} />
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default withRouter(App)
