import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(
  React.createElement(App),
  root,
);
