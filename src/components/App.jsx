// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Config from 'Config'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import PropTypes from 'prop-types'
import HomePage from './home/HomePage'
import '../styles/main.scss'
import Editor from './editor/Editor'
import Footer from './Footer'
import { Route, Switch, Redirect } from 'react-router-dom'
import ImportResourceTemplate from './templates/ImportResourceTemplate'
import LoadResource from './load/LoadResource'
import Search from './search/Search'
import CanvasMenu from './menu/CanvasMenu'
import { saveAppVersion, saveHoneybadgerNotifier } from 'actions/index'
import { useDispatch, useSelector } from 'react-redux'
import { version } from '../../package.json'
import { newResource as newResourceCreator } from 'actionCreators/resources'
import loadLanguages from 'actionCreators/languages'
import { newResourceErrorKey } from './templates/SinopiaResourceTemplates'
import listExports from 'actionCreators/export'
import Exports, { exportsErrorKey } from './exports/Exports'
import { hasResource as hasResourceSelector } from 'selectors/resourceSelectors'

const FourOhFour = () => <h1>404</h1>

const App = (props) => {
  const dispatch = useDispatch()
  const newResource = rtId => dispatch(newResourceCreator(rtId, newResourceErrorKey))

  useEffect(() => {
    dispatch(saveAppVersion(version))
    dispatch(loadLanguages())
    dispatch(listExports(exportsErrorKey))
    dispatch(saveHoneybadgerNotifier(props.honeybadger))
  }, [dispatch, props.honeybadger])

  const hasResource = useSelector(state => hasResourceSelector(state))
  const currentSession = useSelector(state => (state.authenticate.authenticationState ? state.authenticate.authenticationState.currentSession : null))

  const editorWithRtId = (thisprops) => {
    newResource(thisprops.match.params.rtId)
      .then((result) => {
        if (result) {
          return (<Editor {...props} triggerHandleOffsetMenu={thisprops.handleOffsetMenu} />)
        }
        thisprops.history.push('/templates')
      })
  }


  const routesWithCurrentSession = (
    <Switch>
      <Route exact path="/" render={renderProps => <HomePage {...renderProps} triggerHandleOffsetMenu={props.handleOffsetMenu} />} />
      {!hasResource
        && <Route exact path="/editor/:rtId" render={props => editorWithRtId(props)} />
      }

      {hasResource ? (
        <Route path="/editor" render={renderProps => <Editor {...renderProps} triggerHandleOffsetMenu={props.handleOffsetMenu} />} />
      ) : (
        <Redirect from="/editor" to="/templates" />
      )}
      <Route exact path="/templates" render={renderProps => <ImportResourceTemplate {...renderProps}
                                                                                    triggerHandleOffsetMenu={props.handleOffsetMenu}
                                                                                    key="import-resource-template" />} />
      <Route exact path="/search" render={renderProps => <Search {...renderProps} triggerHandleOffsetMenu={props.handleOffsetMenu} />} />
      <Route exact path="/load" render={renderProps => <LoadResource {...renderProps} triggerHandleOffsetMenu={props.handleOffsetMenu} />} />
      <Route exact path="/exports" render={renderProps => <Exports {...renderProps} triggerHandleOffsetMenu={props.handleOffsetMenu} />} />
      <Route path="/menu" render={renderProps => <CanvasMenu {...renderProps} />} />
      <Route id="404" component={FourOhFour} />
    </Switch>
  )

  const routesWithOutCurrentSession = (
    <Route render={renderProps => <HomePage {...renderProps} triggerHandleOffsetMenu={props.handleOffsetMenu} />} />
  )

  return (
    <HelmetProvider>
      <div id="app">
        <Helmet>
          <title>Sinopia {Config.sinopiaEnv}</title>
        </Helmet>
        {currentSession ? routesWithCurrentSession : routesWithOutCurrentSession }
        <Footer />
      </div>
    </HelmetProvider>
  )
}

App.propTypes = {
  handleOffsetMenu: PropTypes.func,
  honeybadger: PropTypes.object,
}

export default App
