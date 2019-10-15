// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addResource } from 'actionCreators/resources'
import { removeResource } from 'actions/index'
import { getResourceTemplate } from 'selectors/resourceSelectors'

const PropertyActionButtons = (props) => {
  const handleAddClick = (event) => {
    event.preventDefault()
    props.addResource(props.reduxPath)
  }

  const handleRemoveClick = (event) => {
    event.preventDefault()
    props.removeResource(props.reduxPath.slice(0, props.reduxPath.length - 1))
  }

  return (<div className="btn-group" role="group" aria-label="...">
    { props.addButtonHidden
      || <button className="btn btn-outline-secondary btn-sm btn-add-another"
                 onClick={ handleAddClick }>Add another {props.resourceLabel}</button>
    }
    { props.removeButtonHidden
      || <button className="btn btn-outline-secondary btn-sm btn-remove-another"
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

const mapDispatchToProps = dispatch => bindActionCreators({ addResource, removeResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PropertyActionButtons)
