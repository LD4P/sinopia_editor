import React from 'react';
import { hot } from 'react-hot-loader';
import Header from './Header';
import NewsPanel from './NewsPanel';
import DescPanel from './DescPanel';
import Footer from './Footer';
import '../styles/main.css';


const App = () => (
  <div id="app">
    <Header />
    <NewsPanel />
    <DescPanel />
    <Footer />
  </div>
);

export default hot(module)(App);
