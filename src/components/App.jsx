/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import HomePage from './HomePage'
import '../styles/main.css'
import Editor from './editor/Editor'
import Footer from './Footer'
import CanvasMenu from './CanvasMenu'
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

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
              <div id="app">
                <Switch>
                  <Route exact path='/' render={(props)=><HomePage {...props} triggerHandleOffsetMenu={this.handleOffsetMenu} />} />
                  <Route exact path='/editor' render={(props)=><Editor {...props} triggerHandleOffsetMenu={this.handleOffsetMenu} />} />
                  <Route id="404" component={FourOhFour} />
                </Switch>
                <Footer />
              </div>
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
