// Copyright 2018 Stanford University see LICENSE for license

import React from "react"
import Package from "../../package.json"

const Footer = () => (
  <div id="footer" className="row">
    <div id="footer-image" className="col-xs-6 col-sm-1">
      <a
        className="footer-image"
        rel="license noopener noreferrer"
        href="http://creativecommons.org/publicdomain/zero/1.0/"
        target="_blank"
      >
        <img alt="CC0" src="https://licensebuttons.net/p/zero/1.0/88x31.png" />
      </a>
    </div>
    <div id="footer-text" className="col-xs-6 col-sm-10">
      <p>
        <small>
          Sinopia is a project of{" "}
          <a
            rel="grant noopener noreferrer"
            href="http://www.ld4p.org"
            target="_blank"
          >
            Linked Data for Production 2 (LD4P2)
          </a>
          , generously funded by the Andrew W. Mellon Foundation. All metadata
          available on Sinopia are published free of restrictions, under the
          terms of the&nbsp;
          <a
            rel="license noopener noreferrer"
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
          >
            Creative Commons CC0 1.0 Universal Public Domain Dedication
          </a>
          . Published <a href="/vocabulary">Vocabulary</a>. &nbsp; If you cannot
          access content or use features on this website due to a disability,
          please&nbsp;
          <a
            rel="noopener noreferrer"
            href="mailto:library-accessibility-contact@lists.stanford.edu"
          >
            report your accessibility issue
          </a>
          . &nbsp;Sinopia v{Package.version}
        </small>
      </p>
    </div>
  </div>
)

export default Footer
