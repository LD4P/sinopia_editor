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

          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a><strong>Help</strong></a>
          </li>
          <li><a href="https://github.com/ld4p/sinopia/wiki" target="_blank" rel="noopener noreferrer" className="menu-item">Sinopia help site</a></li>
          <li><a href="https://listserv.loc.gov/cgi-bin/wa?A0=PCCTG1" target="_blank" rel="noopener noreferrer" className="menu-item">Cataloger listserv</a></li>
          <li><a href="https://github.com/LD4P/sinopia/issues" target="_blank" rel="noopener noreferrer" className="menu-item">Report an issue in github</a></li>
          <li><a href="https://ld4.slack.com/messages/#sinopia" target="_blank" rel="noopener noreferrer" className="menu-item">Join Slack channel</a></li>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a><strong>Training Resources</strong></a>
          </li>
          <li><a href="https://github.com/LD4P/sinopia/wiki/Training-Videos-based-on-Library-of-Congress-tools" target="_blank" rel="noopener noreferrer" className="menu-item">LC Training Modules</a></li>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a><strong>External Identifier Sources and Vocabularies</strong></a>
          </li>
          <li><a href="http://www.getty.edu/research/tools/vocabularies/aat/" target="_blank" rel="noopener noreferrer" className="menu-item">Art & Architecture Thesaurus</a></li>
          <li><a href="https://www.discogs.com/search/" target="_blank" rel="noopener noreferrer" className="menu-item">Discogs</a></li>
          <li><a href="http://www.geonames.org/" target="_blank" rel="noopener noreferrer" className="menu-item">Geonames</a></li>
          <li><a href="https://www.imdb.com/" target="_blank" rel="noopener noreferrer" className="menu-item">IMDB</a></li>
          <li><a href="http://www.isni.org/" target="_blank" rel="noopener noreferrer" className="menu-item">ISNI</a></li>
          <li><a href="https://portal.issn.org" target="_blank" rel="noopener noreferrer" className="menu-item">ISSN Portal</a></li>
          <li><a href="https://id.loc.gov" target="_blank" rel="noopener noreferrer" className="menu-item">LC Linked Data Service</a></li>
          <li><a href="https://musicbrainz.org/" target="_blank" rel="noopener noreferrer" className="menu-item">MusicBrainz</a></li>
          <li><a href="https://orcid.org" target="_blank" rel="noopener noreferrer" className="menu-item">ORCID</a></li>
          <li><a href="https://www.rdaregistry.info" target="_blank" rel="noopener noreferrer" className="menu-item">RDA Registry</a></li>
          <li><a href="http://www.loc.gov/pictures/collection/tgm/" target="_blank" rel="noopener noreferrer" className="menu-item">Thesaurus of Graphic Materials</a></li>
          <li><a href="http://www.getty.edu/research/tools/vocabularies/tgn/index.html" rel="noopener noreferrer"  target="_blank" className="menu-item">Getty Thes. of Geographic Names</a></li>
          <li><a href="https://viaf.org" rel="noopener noreferrer"  target="_blank" className="menu-item">VIAF</a></li>
          <li><a href="https://www.wikidata.org/wiki/Wikidata:Main_Page" target="_blank" rel="noopener noreferrer" className="menu-item">Wikidata</a></li>
          <br></br>
          <li>
            <FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} /> <a><strong>Other External Resources</strong></a>
          </li>
          <li><a href="https://books.google.com/" target="_blank" rel="noopener noreferrer" className="menu-item">Google Books</a></li>
          <li><a href="https://scholar.google.com/" target="_blank" rel="noopener noreferrer" className="menu-item">Google Scholar</a></li>
          <li><a href="https://translate.google.com/" target="_blank" rel="noopener noreferrer" className="menu-item">Google Translate</a></li>
          <li><a href="http://www.share-vde.org/sharevde/clusters?l=en" target="_blank" rel="noopener noreferrer" className="menu-item">Share-VDE</a></li>

        </ul>
      </div>
    );
  };
};

CanvasMenu.propTypes = {
  closeHandleMenu: PropTypes.func
}

export default CanvasMenu;
