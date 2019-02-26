// Copyright 2018 Stanford University see Apache2.txt for license

import React from 'react';
import ReactDOM from 'react-dom';
import RootContainer from './components/RootContainer';

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(
  React.createElement(RootContainer),
  root
);
