// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addResource as addResourceCreator } from 'actionCreators/resources'
import { removeResource as removeResourceAction } from 'actions/index'
import { getResourceTemplate } from 'selectors/resourceSelectors'

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
      || <button className="btn btn-default btn-sm btn-add-another"
                 onClick={ handleAddClick }>Add another {props.resourceLabel}</button>
    }
    { props.removeButtonHidden
      || <button className="btn btn-default btn-sm btn-remove-another"
                 onClick={ handleRemoveClick }>Remove {props.resourceLabel}</button>
    }

  </div>)
}
PropertyActionButtons.propTypes = {
  reduxPath: PropTypes.array,
  removeButtonHidden: PropTypes.bool,
  addButtonHidden: PropTypes.bool,
  addResource: PropTypes.func,
  removeResource: PropTypes.func,
  resourceLabel: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
  const resourceTemplateId = ownProps.reduxPath.slice(-1)[0]
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const resourceLabel = resourceTemplate.resourceLabel
  return {
    resourceLabel,
  }
}

const mapDispatchToProps = dispatch => ({
  addResource(reduxPath) {
    dispatch(addResourceCreator(reduxPath))
  },
  removeResource(reduxPath) {
    dispatch(removeResourceAction(reduxPath.slice(0, reduxPath.length - 1)))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(PropertyActionButtons)
