// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import ReactDOM from "react-dom"
import RootContainer from "./components/RootContainer"
import "@popperjs/core"
import "bootstrap"

const root = document.createElement("div")
root.className = "container-fluid"
document.body.appendChild(root)

ReactDOM.render(React.createElement(RootContainer), root)
