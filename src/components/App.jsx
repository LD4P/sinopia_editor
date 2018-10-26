import React from 'react';
import { hot } from 'react-hot-loader';
import Header from './Header';
import NewsPanel from './NewsPanel';
import '../styles/main.css';


const App = () => (
  <div id="app">
    <Header />
    <NewsPanel />
  </div>
);

export default hot(module)(App);
