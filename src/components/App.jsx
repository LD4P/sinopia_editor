import React from 'react';
import { hot } from 'react-hot-loader';
import Header from './Header';

const App = () => (
  <div id="app">
    <Header />
  </div>
);

export default hot(module)(App);
