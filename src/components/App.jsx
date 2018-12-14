// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import HomePage from './HomePage'
import '../styles/main.css'
import Editor from './editor/Editor'
import Footer from './Footer'
import CanvasMenu from './CanvasMenu'
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store'

const FourOhFour = () => <h1>404</h1>
class App extends Component{
  constructor(props) {
    super(props)
    this.handleOffsetMenu = this.handleOffsetMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
    this.state = {
      isMenuOpened: false
    }
  }

  handleOffsetMenu() {
    console.log('AM I GETTING CLICKED?')
    this.setState({
      isMenuOpened: !this.state.isMenuOpened
    })
  }

  closeMenu() {
    this.setState({
      isMenuOpened: false
    })
  }
  render() {
    let offcanvas_class = this.state.isMenuOpened? "closeMargin" : null
    return(
      <div id="home-page">
        <OffCanvas width={300} transitionDuration={300} isMenuOpened={this.state.isMenuOpened} position={"right"}>
          <OffCanvasBody className={offcanvas_class}>
            <BrowserRouter>
              <Provider store={store}>
                <div id="app">
                  <Switch>
                    <Route exact path='/' render={(props)=><HomePage {...props} triggerHandleOffsetMenu={this.handleOffsetMenu} />} />
                    <Route exact path='/editor' render={(props)=><Editor {...props} triggerHandleOffsetMenu={this.handleOffsetMenu} />} />
                    <Route id="404" component={FourOhFour} />
                  </Switch>
                  <Footer />
                </div>
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

export default hot(module)(App)
