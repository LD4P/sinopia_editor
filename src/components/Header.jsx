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
        <a className="header-text" href="https://google.com">Profile Editor</a>
      </li>
      <li className="dropdown">
        <a href="#" className="dropdown-toggle header-text" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Help and Resources<span className="caret"></span></a>
        <ul className="dropdown-menu">
          <li><a href="#" ><strong>Sinopia User Dashboard</strong></a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#"><strong>Contact Us</strong></a></li>
          <li><a href="#" >E-mail Sinopia group</a></li>
          <li><a href="https://ld4.slack.com/messages/#sinopia" >Join Slack Channel</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#"><strong>Training Resources</strong></a></li>
          <li><a href="#" >Intro to Profile Editor</a></li>
          <li><a href="#" >Intro to Bibliographic Editor</a></li>
          <li><a href="#" >Troubleshooting</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#"><strong>Website Usage</strong></a></li>
          <li><a href="#" >Policies</a></li>
          <li><a href="#" >Terms of Use</a></li>
          <li><a href="#" >Request Account</a></li>
          <li role="separator" className="divider"></li>
          <li><a href="#"><strong>External Resources</strong></a></li>
          <li><a href="http://www.getty.edu/research/tools/vocabularies/aat/" >Art & Architecture Thesaurus</a></li>
          <li><a href="https://www.discogs.com/search/" >Discogs</a></li>
          <li><a href="http://www.geonames.org/" >Geonames</a></li>
          <li><a href="https://translate.google.com/" >Google Translate</a></li>
          <li><a href="https://www.imdb.com/" >IMDB</a></li>
          <li><a href="http://www.isni.org/" >ISNI</a></li>
          <li><a href="http://id.loc.gov/authorities/names.html" >Library of Congress</a></li>
          <li><a href="https://musicbrainz.org/" >MusicBrainz</a></li>
          <li><a href="http://www.share-vde.org/sharevde/clusters?l=en" >Share-VDE</a></li>
          <li><a href="http://www.loc.gov/pictures/collection/tgm/" >Thesaurus of Graphic Materials</a></li>
          <li><a href="http://www.getty.edu/research/tools/vocabularies/tgn/index.html" >Thesaurus of Geographical Names</a></li>
          <li><a href="https://viaf.org/" >VIAF</a></li>
          <li><a href="https://www.wikidata.org/wiki/Wikidata:Main_Page" >Wikidata</a></li>
        </ul>
      </li>
    </ul>
  </div>
);

export default Header;
