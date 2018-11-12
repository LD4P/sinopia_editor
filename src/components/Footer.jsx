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
import React from 'react'

const Footer = () => (
  <div id="footer" className="row">
    <div id="footer-image" className="col-xs-6 col-sm-1">
      <a className='footer-image' rel="license" href="http://creativecommons.org/publicdomain/zero/1.0/" target="_blank">
        <img alt="CC0" src="http://i.creativecommons.org/p/zero/1.0/88x31.png" />
      </a>
    </div>
    <div id="footer-text" className="col-xs-6 col-sm-10">
      <p>
        <small>
        Sinopia is a project of <a rel="grant" href="http://www.ld4p.org" target="_blank"> Linked Data for Production 2 (LD4P2)</a>, generously funded by the Andrew W. Mellon Foundation.
        All metadata available on Sinopia are published free of restrictions, under the terms of the <a rel="license" href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank">Creative Commons CC0 1.0 Universal Public Domain Dedication</a>.
        </small>
      </p>
    </div>
  </div>
)

export default Footer
