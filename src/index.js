// Copyright 2018, 2019 Stanford University see LICENSE for license

import React from 'react'
import ReactDOM from 'react-dom'
import RootContainer from './components/RootContainer'

// Needed for Hot Module Replacement in dev
module.hot?.accept()

const root = document.createElement('div')

document.body.appendChild(root)

ReactDOM.render(
  React.createElement(RootContainer),
  root,
)
