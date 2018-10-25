import React from 'react';
import SinopiaLogo from '../styles/sinopia-logo.png';

const Header = () => (
  <div id="header-container">
    <div id="header">
      <div className="brand-logo">
        <a href="https://google.com">
          <img src={SinopiaLogo} height="35px" className="display-large" />
        </a>
      </div>
    </div>
  </div>
);

export default Header;
