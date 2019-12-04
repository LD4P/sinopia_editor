// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { hot } from 'react-hot-loader'
import { OffCanvas, OffCanvasBody, OffCanvasMenu } from 'react-offcanvas'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import ErrorBoundary from '@honeybadger-io/react'
import CanvasMenu from './menu/CanvasMenu'
import App from './App'
import store from '../store'
import { getHoneybadgerNotifier } from 'Utilities'


const RootContainer = (_props) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false)

  const closeMenu = () => {
    setIsMenuOpened(false)
  }

  const handleOffsetMenu = () => {
    setIsMenuOpened(!isMenuOpened)
  }

  const offcanvasClass = isMenuOpened ? 'closeMargin' : null

  // the ErrorBoundary element expects exactly one child element, otherwise it will throw warnings in the browser console like:
  // `Warning: Failed prop type: Invalid prop `children` of type `array` supplied to `HoneyBadgerErrorBoundary`, expected a single ReactElement.`
  return (
    <ErrorBoundary honeybadger={getHoneybadgerNotifier()}>
      <div id="home-page">
        <OffCanvas width={300} transitionDuration={300} isMenuOpened={isMenuOpened} position={'right'} effect={'overlay'}>
          <OffCanvasBody className={offcanvasClass}>
            <BrowserRouter>
              <Provider store={store}>
                <App isMenuOpened={isMenuOpened} handleOffsetMenu={handleOffsetMenu}/>
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
