import React from 'react';

const Footer = () => (
  <div id="footer" className="row">
    <div id="footer-image" className="col-xs-2">
      <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
        <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by/4.0/88x31.png" />
      </a>
    </div>
    <div id="footer-text" className="col-xs-10">  
      <p>
        <small>
        Sinopia is a project of <a href="">Linked Data for Production 2 (LD4P2)</a>, generously funded by the Andrew W. Mellon Foundation.
        All content in Sinopia is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
        </small>
      </p>
    </div>
  </div>
);

export default Footer;