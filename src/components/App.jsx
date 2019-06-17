// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import LoginPanel from './LoginPanel'
import HomePage from './home/HomePage'
import '../styles/main.css'
import Editor from './editor/Editor'
import Footer from './Footer'
import { Route, Switch, withRouter } from 'react-router-dom'
import ImportResourceTemplate from './templates/ImportResourceTemplate'
import Browse from './browse/Browse'
import CanvasMenu from './menu/CanvasMenu'
import { connect } from 'react-redux'


const FourOhFour = () => <h1>404</h1>

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectToReferrer: false,
      isMenuOpened: false,
    }
  }

  render() {
    const PrivateRoute = ({ component: ImportResourceTemplate, ...rest }) => (
      <Route
        {...rest}
        render={props => (this.props.currentSession ? (<ImportResourceTemplate {...props} />) : null)
        }
      />
    )

    return (
      <div id="app">
        <LoginPanel />
        <Switch>
          <Route exact path="/" render={props => <HomePage {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <Route exact path="/editor" render={props => <Editor {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <PrivateRoute exact path="/templates" component={props => <ImportResourceTemplate {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />}/>
          <Route exact path="/browse" render={props => <Browse {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <Route path="/menu" render={props => <CanvasMenu {...props} />} />
          <Route id="404" component={FourOhFour} />
        </Switch>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentSession: state.authenticate.authenticationState ? state.authenticate.authenticationState.currentSession : null,
})

/*
 * 2019-05-07: note that withRouter must wrap connect
 * see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md#important-note
 */
export default withRouter(connect(mapStateToProps)(App))
