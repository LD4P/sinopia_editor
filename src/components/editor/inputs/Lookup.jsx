// Copyright 2020 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import LookupTabs from "./LookupTabs"
import _ from "lodash"

const Lookup = ({
  query,
  hideLookup,
  propertyTemplate,
  show,
  handleUpdateURI,
  handleUpdateLiteral,
}) => {
  const handleLiteralClick = (event) => {
    event.preventDefault()
    handleUpdateLiteral(query)
  }

  if (!show || _.isEmpty(query)) return null

  return (
    <div className="container lookup" data-testid={`${query} lookup`}>
      <div className="row">
        <div className="col">
          <button onClick={handleLiteralClick} className="btn btn-link p-0">
            Add &quot;{query}&quot; as literal
          </button>
          &nbsp;or select from:
        </div>
      </div>
      <div className="row">
        <section className="col">
          <button
            className="btn btn-lg float-end py-0"
            onClick={hideLookup}
            data-testid={`Close lookup for ${propertyTemplate.label}`}
            aria-label={`Close lookup for ${propertyTemplate.label}`}
          >
            &times;
          </button>
        </section>
      </div>
      <div className="row">
        <div className="col lookup-search-results">
          <LookupTabs
            authorityConfigs={propertyTemplate.authorities}
            query={query}
            handleUpdateURI={handleUpdateURI}
          />
        </div>
      </div>
    </div>
  )
}

Lookup.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  show: PropTypes.bool,
  query: PropTypes.string.isRequired,
  hideLookup: PropTypes.func.isRequired,
  handleUpdateURI: PropTypes.func.isRequired,
  handleUpdateLiteral: PropTypes.func.isRequired,
}

export default Lookup
