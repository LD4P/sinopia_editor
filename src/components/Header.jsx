import React from 'react';
import SinopiaLogo from '../styles/sinopia-logo.png';
import { Link } from 'react-router-dom'

const Header = () => (
  <div className="navbar">
    <div className="navbar-header">
      <a className="navbar-brand" href="https://google.com">
        <img src={SinopiaLogo} height="55px" />
      </a>
    </div>
    <ul className= "nav navbar-nav pull-right">
      <li>
        <Link to='/search'> BFF (Bib Editor) </Link>
      </li>
      <li>
        <a className="header-text" href="https://sinopia-pe.dev.sul.stanford.edu">Profile Editor</a>
      </li>
      <li className="dropdown">
        <a href="#" className="dropdown-toggle header-text" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Help and Resources<span className="caret"></span></a>
        <ul className="dropdown-menu">
          <li><a href="#" target="_blank" className="menu-item"><strong>Sinopia User Dashboard</strong></a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#"><strong>Contact Us</strong></a></li>
          <li><a href="#" target="_blank" className="menu-item">E-mail Sinopia group</a></li>
          <li><a href="https://ld4.slack.com/messages/#sinopia" className="menu-item">Join Slack Channel</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#"><strong>Training Resources</strong></a></li>
          <li><a href="#" target="_blank" className="menu-item">Intro to Profile Editor</a></li>
          <li><a href="#" target="_blank" className="menu-item">Intro to Bibliographic Editor</a></li>
          <li><a href="#" target="_blank" className="menu-item">Troubleshooting</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#"><strong>Website Usage</strong></a></li>
          <li><a href="#" target="_blank" className="menu-item">Policies</a></li>
          <li><a href="#" target="_blank" className="menu-item">Terms of Use</a></li>
          <li><a href="#" target="_blank" className="menu-item">Request Account</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#"><strong>External Resources</strong></a></li>
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
      </li>
    </ul>
  </div>
);

export default Header;
