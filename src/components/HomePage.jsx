import React from 'react';
import Header from './Header';
import NewsPanel from './NewsPanel';
import DescPanel from './DescPanel';

const HomePage = () => (
  <div id="home-page">
    <Header />
    <NewsPanel />
    <DescPanel />
  </div>
);

export default HomePage;
