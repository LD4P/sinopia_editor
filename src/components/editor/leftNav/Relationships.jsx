// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import RelationshipsDisplay from "./RelationshipsDisplay"

const Relationships = ({ resourceKey }) => (
  <div className="row">
    <div className="col">
      <RelationshipsDisplay resourceKey={resourceKey} />
    </div>
  </div>
)

Relationships.propTypes = {
  resourceKey: PropTypes.string.isRequired,
}

export default Relationships
