import React, { Component } from 'react'
import Header from './Header'
import NewsPanel from './NewsPanel'
import DescPanel from './DescPanel'
import CanvasMenu from './CanvasMenu'
import Footer from './Footer'
import { OffCanvas, OffCanvasMenu, OffCanvasBody } from 'react-offcanvas'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.handleOffsetMenu = this.handleOffsetMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
    this.state = {
      isMenuOpened: false
    }
  }

  handleOffsetMenu() {
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
            <div>
              <Header triggerHandleOffsetMenu={this.handleOffsetMenu} />
              <NewsPanel />
              <DescPanel />
              <Footer />
            </div>
          </OffCanvasBody>
          <OffCanvasMenu className="offcanvas-menu">
            <CanvasMenu closeHandleMenu={this.closeMenu} />
          </OffCanvasMenu>
        </OffCanvas>
      </div>   
    )
  }
}

export default HomePage