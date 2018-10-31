import React from 'react';
import SinopiaLogo from '../styles/sinopia-logo.png';

const Header = () => (
  <div class="navbar">
    <div class="navbar-header">
      <a class="navbar-brand" href="https://google.com">
        <img src={SinopiaLogo} height="55px" />
      </a>
    </div>
    <ul class= "nav navbar-nav pull-right">
      <li>
        <a href="https://google.com">Profile Editor</a>
      </li>
      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Help and Resources <span class="caret"></span></a>
        <ul class="dropdown-menu">
          <li><a href="#">Contact Us</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">Training Resources</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">Website Usage</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">External Resources</a></li>
          <li role="separator" class="divider"></li>
          <li><a href="#">One more separated link</a></li>
        </ul>
      </li>
    </ul>
  </div>
);

export default Header;
