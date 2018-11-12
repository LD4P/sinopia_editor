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
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons'


class CanvasMenu extends Component {
  render() {
    return(
      <div>
        <a href="#" onClick={this.props.closeHandleMenu}>
          <FontAwesomeIcon className="close-icon" icon={faTimes} />
        </a>
        <ul style={{listStyleType:'none'}}>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a href="#" target="_blank"><strong>Sinopia User Dashboard</strong></a>
          </li>
          <br></br>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a href="#"><strong>Contact Us</strong></a>
          </li>
          <li><a href="#" target="_blank" className="menu-item">E-mail Sinopia group</a></li>
          <li><a href="https://ld4.slack.com/messages/#sinopia" className="menu-item">Join Slack Channel</a></li>
          <br></br>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a href="#"><strong>Training Resources</strong></a>
          </li>
          <li><a href="#" target="_blank" className="menu-item">Intro to Profile Editor</a></li>
          <li><a href="#" target="_blank" className="menu-item">Intro to Bibliographic Editor</a></li>
          <li><a href="#" target="_blank" className="menu-item">Troubleshooting</a></li>
          <br></br>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a href="#"><strong>Website Usage</strong></a>
          </li>
          <li><a href="#" target="_blank" className="menu-item">Policies</a></li>
          <li><a href="#" target="_blank" className="menu-item">Terms of Use</a></li>
          <li><a href="#" target="_blank" className="menu-item">Request Account</a></li>
          <br></br>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a href="#"><strong>External Resources</strong></a>
          </li>
          <li><a href="http://www.getty.edu/research/tools/vocabularies/aat/" target="_blank" className="menu-item">Art & Architecture Thesaurus</a></li>
          <li><a href="https://www.discogs.com/search/" target="_blank" className="menu-item">Discogs</a></li>
          <li><a href="http://www.geonames.org/" target="_blank" className="menu-item">Geonames</a></li>
          <li><a href="https://translate.google.com/" target="_blank" className="menu-item">Google Translate</a></li>
          <li><a href="https://www.imdb.com/" target="_blank" className="menu-item">IMDB</a></li>
          <li><a href="http://www.isni.org/" target="_blank" className="menu-item">ISNI</a></li>
          <li><a href="http://id.loc.gov/authorities/names.html" target="_blank" className="menu-item">Library of Congress</a></li>
          <li><a href="https://musicbrainz.org/" target="_blank" className="menu-item">MusicBrainz</a></li>
          <li><a href="http://www.share-vde.org/sharevde/clusters?l=en" target="_blank" className="menu-item">Share-VDE</a></li>
          <li><a href="http://www.loc.gov/pictures/collection/tgm/" target="_blank" className="menu-item">Thesaurus of Graphic Materials</a></li>
          <li><a href="http://www.getty.edu/research/tools/vocabularies/tgn/index.html" target="_blank" className="menu-item">Thesaurus of Geographical Names</a></li>
          <li><a href="https://viaf.org/" target="_blank" className="menu-item">VIAF</a></li>
          <li><a href="https://www.wikidata.org/wiki/Wikidata:Main_Page" target="_blank" className="menu-item">Wikidata</a></li>
        </ul>
      </div>
    );
  };
};

export default CanvasMenu;
