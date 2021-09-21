// Copyright 2019 Stanford University see LICENSE for license

import { nanoid } from "nanoid"
import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAsterisk } from "@fortawesome/free-solid-svg-icons"

const RequiredSuperscript = () => (
  <sup
    aria-label="required"
    placement="right"
    trigger={["hover", "focus"]}
    key={nanoid()}
    title="please fill out this field"
  >
    <FontAwesomeIcon className="left-space" icon={faAsterisk} />
  </sup>
)

export default RequiredSuperscript
