// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { OffCanvas, OffCanvasBody, OffCanvasMenu } from 'react-offcanvas'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Honeybadger from 'honeybadger-js'
import ErrorBoundary from '@honeybadger-io/react'
import CanvasMenu from './menu/CanvasMenu'
import App from './App'
import store from '../store'
import Config from 'Config'


const RootContainer = (_props) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const honeybadger = Honeybadger.configure({
    apiKey: Config.honeybadgerApiKey,
    environment: process.env.SINOPIA_ENV,
  })

  const closeMenu = () => {
    setIsMenuOpened(false)
  }

  const handleOffsetMenu = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  const offcanvasClass = isMenuOpened ? 'closeMargin' : null

  // notes:
  //  * the ErrorBoundary element expects exactly one child element, otherwise it will throw warnings in the browser console like:
  //    `Warning: Failed prop type: Invalid prop `children` of type `array` supplied to `HoneyBadgerErrorBoundary`, expected a single ReactElement.`
  //  * can't save to the store in this component, can only do that in element wrapped in <Provider> element, so pass honeybadger notifier
  //  down to App.  but configure it here so we can wrap as much as possible in ErrorBoundary.
  return (
    <ErrorBoundary honeybadger={honeybadger}>
      <div id="home-page">
        <OffCanvas width={300} transitionDuration={300} isMenuOpened={isMenuOpened} position={'right'} effect={'overlay'}>
          <OffCanvasBody className={offcanvasClass}>
            <BrowserRouter>
              <Provider store={store}>
                <App isMenuOpened={isMenuOpened} honeybadger={honeybadger} handleOffsetMenu={handleOffsetMenu}/>
              </Provider>
            </BrowserRouter>
          </OffCanvasBody>
          <OffCanvasMenu className="offcanvas-menu">
            <CanvasMenu closeHandleMenu={closeMenu} />
          </OffCanvasMenu>
        </OffCanvas>
      </div>
    </ErrorBoundary>
  )
}

export default hot(module)(RootContainer)
