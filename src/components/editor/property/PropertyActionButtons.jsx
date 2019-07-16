// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addResource as addResourceCreator } from 'actionCreators/resources'
import { removeResource as removeResourceAction } from 'actions/index'


const PropertyActionButtons = (props) => {
  const handleAddClick = (event) => {
    event.preventDefault()
    props.addResource(props.reduxPath)
  }

  const handleRemoveClick = (event) => {
    event.preventDefault()
    props.removeResource(props.reduxPath)
  }

  return (<div className="btn-group" role="group" aria-label="...">
    { props.addButtonHidden
      || <button className="btn btn-default btn-sm btn-add"
                 onClick={ handleAddClick }
                 disabled={ props.addButtonDisabled }>Add</button>
    }
    { props.removeButtonHidden
      || <button className="btn btn-default btn-sm btn-remove"
                 onClick={ handleRemoveClick }>Remove</button>
    }

  </div>)
}
PropertyActionButtons.propTypes = {
  reduxPath: PropTypes.array,
  addButtonDisabled: PropTypes.bool,
  removeButtonHidden: PropTypes.bool,
  addButtonHidden: PropTypes.bool,
  addResource: PropTypes.func,
  removeResource: PropTypes.func,
}

const mapDispatchToProps = dispatch => ({
  addResource(reduxPath) {
    dispatch(addResourceCreator(reduxPath))
  },
  removeResource(reduxPath) {
    dispatch(removeResourceAction(reduxPath))
  },
})

export default connect(null, mapDispatchToProps)(PropertyActionButtons)
