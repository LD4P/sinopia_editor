// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import App from './App'
import CanvasMenu from './CanvasMenu'
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store'

class RootContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuOpened: false,
      redirectToReferrer: false
    }
  }

  closeMenu = () => {
    this.setState({
      isMenuOpened: false
    })
  }

  handleOffsetMenu = () => {
    this.setState({
      isMenuOpened: !this.state.isMenuOpened
    })
  }

  render(){
    let offcanvas_class = this.state.isMenuOpened? "closeMargin" : null
    return(
      <div id="home-page">
        <OffCanvas width={300} transitionDuration={300} isMenuOpened={this.state.isMenuOpened} position={"right"}>
          <OffCanvasBody className={offcanvas_class}>
            <BrowserRouter>
              <Provider store={store}>
                <App isMenuOpened={this.state.isMenuOpened} handleOffsetMenu={this.handleOffsetMenu}/>
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
