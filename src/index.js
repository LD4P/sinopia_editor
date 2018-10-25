import React from 'react';
import ReactDOM from 'react-dom';

const title = 'Lets Get it';

ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('app')
);

module.hot.accept();
