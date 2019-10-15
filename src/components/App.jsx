// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import DocumentMeta from 'react-document-meta'
import Config from 'Config'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import LoginPanel from './LoginPanel'
import PropTypes from 'prop-types'
import HomePage from './home/HomePage'
import '../styles/main.css'
import Editor from './editor/Editor'
import Footer from './Footer'
import {
  Route, Switch, withRouter, Redirect,
} from 'react-router-dom'
import ImportResourceTemplate from './templates/ImportResourceTemplate'
import LoadResource from './load/LoadResource'
import Search from './search/Search'
import CanvasMenu from './menu/CanvasMenu'
import { saveAppVersion } from 'actions/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { version } from '../../package.json'
import { fetchResourceTemplateSummaries } from 'actionCreators/resourceTemplates'

import _ from 'lodash'

const FourOhFour = () => <h1>404</h1>

class App extends Component {
  componentDidMount() {
    this.props.saveAppVersion(version)
    this.props.fetchResourceTemplateSummaries()
  }

  render() {
    let routes
    if (this.props.currentSession) {
      routes = (
        <Switch>
          <Route exact path="/" render={props => <HomePage {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          {this.props.hasResource ? (
            <Route exact path="/editor" render={props => <Editor {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          ) : (
            <Redirect from="/editor" to="/templates" />
          )}
          <Route exact path="/templates" render={props => <ImportResourceTemplate {...props}
                                                                                  triggerHandleOffsetMenu={this.props.handleOffsetMenu}
                                                                                  key="import-resource-template" />} />
          <Route exact path="/search" render={props => <Search {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <Route exact path="/load" render={props => <LoadResource {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
          <Route path="/menu" render={props => <CanvasMenu {...props} />} />
          <Route id="404" component={FourOhFour} />
        </Switch>
      )
    } else {
      routes = (
        <Route render={props => <HomePage {...props} triggerHandleOffsetMenu={this.props.handleOffsetMenu} />} />
      )
    }
    return (
      <DocumentMeta title={`Sinopia ${Config.sinopiaEnv}`}>
        <div id="app">
          <LoginPanel />
          {routes}
          <Footer />
        </div>
      </DocumentMeta>
    )
  }
}

App.propTypes = {
  saveAppVersion: PropTypes.func,
  currentSession: PropTypes.object,
  handleOffsetMenu: PropTypes.func,
  hasResource: PropTypes.bool,
  fetchResourceTemplateSummaries: PropTypes.func,
}

const mapStateToProps = (state) => {
  const hasResource = !_.isEmpty(state?.selectorReducer?.resource)
  return {
    hasResource,
    currentSession: state.authenticate.authenticationState ? state.authenticate.authenticationState.currentSession : null,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ saveAppVersion, fetchResourceTemplateSummaries }, dispatch)

/*
 * 2019-05-07: note that withRouter must wrap connect
 * see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/withRouter.md#important-note
 */
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
