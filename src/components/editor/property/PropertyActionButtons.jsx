// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addResource } from 'actions/index'

const PropertyActionButtons = props => (<div className="btn-group" role="group" aria-label="...">
  <button className="btn btn-default btn-sm"
          onClick={ props.handleAddClick }
          disabled={ props.addButtonDisabled }>Add</button>
</div>)

PropertyActionButtons.propTypes = {
  addButtonDisabled: PropTypes.bool,
  handleAddClick: PropTypes.func,
  reduxPath: PropTypes.array,
  resourceTemplateId: PropTypes.string,
}

const mapDispatchToProps = (dispatch, ourProps) => ({
  handleAddClick(event) {
    event.preventDefault()
    dispatch(addResource(ourProps.reduxPath, ourProps.resourceTemplateId))
  },
})

export default connect(null, mapDispatchToProps)(PropertyActionButtons)
