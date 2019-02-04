// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faArrowAltCircleRight  } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types'

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
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a href="#" target="_blank" rel="noopener noreferrer" ><strong>Sinopia User Dashboard</strong></a>
          </li>
          <br></br>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a href="#"><strong>Contact Us</strong></a>
          </li>
          <li><a href="#" target="_blank" rel="noopener noreferrer" className="menu-item">E-mail Sinopia group</a></li>
          <li><a href="https://ld4.slack.com/messages/#sinopia" className="menu-item">Join Slack Channel</a></li>
          <br></br>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a href="#"><strong>Training Resources</strong></a>
          </li>
          <li><a href="#" target="_blank" rel="noopener noreferrer" className="menu-item">Intro to Profile Editor</a></li>
          <li><a href="#" target="_blank" rel="noopener noreferrer" className="menu-item">Intro to Bibliographic Editor</a></li>
          <li><a href="#" target="_blank" rel="noopener noreferrer" className="menu-item">Troubleshooting</a></li>
          <br></br>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a href="#"><strong>Website Usage</strong></a>
          </li>
          <li><a href="#" target="_blank" rel="noopener noreferrer" className="menu-item">Policies</a></li>
          <li><a href="#" target="_blank" rel="noopener noreferrer" className="menu-item">Terms of Use</a></li>
          <li><a href="#" target="_blank" rel="noopener noreferrer" className="menu-item">Request Account</a></li>
          <br></br>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a href="#"><strong>External Resources</strong></a>
          </li>
          <li><a href="http://www.getty.edu/research/tools/vocabularies/aat/" target="_blank" rel="noopener noreferrer" className="menu-item">Art & Architecture Thesaurus</a></li>
          <li><a href="https://www.discogs.com/search/" target="_blank" rel="noopener noreferrer" className="menu-item">Discogs</a></li>
          <li><a href="http://www.geonames.org/" target="_blank" rel="noopener noreferrer" className="menu-item">Geonames</a></li>
          <li><a href="https://translate.google.com/" target="_blank" rel="noopener noreferrer" className="menu-item">Google Translate</a></li>
          <li><a href="https://www.imdb.com/" target="_blank" rel="noopener noreferrer" className="menu-item">IMDB</a></li>
          <li><a href="http://www.isni.org/" target="_blank" rel="noopener noreferrer" className="menu-item">ISNI</a></li>
          <li><a href="http://id.loc.gov/authorities/names.html" rel="noopener noreferrer" target="_blank" className="menu-item">Library of Congress</a></li>
          <li><a href="https://musicbrainz.org/" target="_blank" rel="noopener noreferrer" className="menu-item">MusicBrainz</a></li>
          <li><a href="http://www.share-vde.org/sharevde/clusters?l=en" target="_blank" rel="noopener noreferrer" className="menu-item">Share-VDE</a></li>
          <li><a href="http://www.loc.gov/pictures/collection/tgm/" target="_blank" rel="noopener noreferrer" className="menu-item">Thesaurus of Graphic Materials</a></li>
          <li><a href="http://www.getty.edu/research/tools/vocabularies/tgn/index.html" rel="noopener noreferrer"  target="_blank" className="menu-item">Thesaurus of Geographical Names</a></li>
          <li><a href="https://viaf.org/" target="_blank" rel="noopener noreferrer" className="menu-item">VIAF</a></li>
          <li><a href="https://www.wikidata.org/wiki/Wikidata:Main_Page" target="_blank" rel="noopener noreferrer" className="menu-item">Wikidata</a></li>
        </ul>
      </div>
    );
  };
};

CanvasMenu.propTypes = {
  closeHandleMenu: PropTypes.func
}

export default CanvasMenu;
