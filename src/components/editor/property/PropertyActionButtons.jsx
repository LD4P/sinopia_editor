// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'

const PropertyActionButtons = props => (<div className="btn-group" role="group" aria-label="...">
  <button className="btn btn-default btn-sm"
          onClick={ props.handleAddClick }
          disabled={ props.addButtonDisabled }>Add</button>
</div>)

PropertyActionButtons.propTypes = {
  addButtonDisabled: PropTypes.bool,
  handleAddClick: PropTypes.func,
}

export default PropertyActionButtons
