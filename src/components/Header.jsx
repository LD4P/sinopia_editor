import React from 'react';
import SinopiaLogo from '../styles/sinopia-logo.png';

const Header = () => (
  <div className="navbar">
    <div className="navbar-header">
      <a className="navbar-brand" href="https://google.com">
        <img src={SinopiaLogo} height="55px" />
      </a>
    </div>
    <ul className= "nav navbar-nav pull-right">
      <li>
        <a href="https://google.com">Profile Editor</a>
      </li>
      <li className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Help and Resources<span className="caret"></span></a>
        <ul className="dropdown-menu">
          <li><a href="#">Contact Us</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#">Training Resources</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#">Website Usage</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#">External Resources</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#">One more separated link</a></li>
        </ul>
      </li>
    </ul>
  </div>
);

export default Header;
