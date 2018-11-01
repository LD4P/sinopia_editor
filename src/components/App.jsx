import React from 'react';
import { hot } from 'react-hot-loader';
import HomePage from './HomePage';
import Footer from './Footer';
import '../styles/main.css';


const App = () => (
  <div id="app">
    <HomePage /> 
    <Footer />
  </div>
);

export default hot(module)(App);
