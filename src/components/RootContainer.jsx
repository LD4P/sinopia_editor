// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { OffCanvas, OffCanvasBody, OffCanvasMenu } from 'react-offcanvas'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import CanvasMenu from './menu/CanvasMenu'
import App from './App'
import store from '../store'
import HoneybadgerNotifier from 'Honeybadger'
import ErrorBoundary from '@honeybadger-io/react'

class RootContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuOpened: false,
      redirectToReferrer: false,
    }
  }

  closeMenu = () => {
    this.setState({
      isMenuOpened: false,
    })
  }

  handleOffsetMenu = () => {
    this.setState({
      isMenuOpened: !this.state.isMenuOpened,
    })
  }

  render() {
    const offcanvasClass = this.state.isMenuOpened ? 'closeMargin' : null


    return (
      <div id="home-page">
        <OffCanvas width={300} transitionDuration={300} isMenuOpened={this.state.isMenuOpened} position={'right'} effect={'overlay'}>
          <OffCanvasBody className={offcanvasClass}>
            <BrowserRouter>
              <Provider store={store}>
                <ErrorBoundary honeybadger={HoneybadgerNotifier}>
                  <App isMenuOpened={this.state.isMenuOpened} handleOffsetMenu={this.handleOffsetMenu}/>
                </ErrorBoundary>
              </Provider>
            </BrowserRouter>
          </OffCanvasBody>
          <OffCanvasMenu className="offcanvas-menu">
            <CanvasMenu closeHandleMenu={this.closeMenu} />
          </OffCanvasMenu>
        </OffCanvas>
      </div>
    )
  }
}

export default hot(module)(RootContainer)
