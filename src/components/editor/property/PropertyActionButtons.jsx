// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addResource } from 'actionCreators/resources'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { removeResource } from 'actions/index'
import { getResourceTemplate } from 'selectors/resourceSelectors'
import { resourceEditErrorKey } from '../Editor'

const PropertyActionButtons = (props) => {
  const handleAddClick = (event) => {
    event.preventDefault()
    props.addResource(props.reduxPath, resourceEditErrorKey(props.resourceKey))
  }

  const trashIcon = faTrashAlt

  const handleRemoveClick = (event) => {
    event.preventDefault()
    props.removeResource(props.reduxPath.slice(0, props.reduxPath.length - 1))
  }

  return (<div className="btn-group pull-right" role="group" aria-label="...">
    { props.addButtonHidden
      || <button className="btn btn-sm btn-add-property btn-add-another"
                 onClick={ handleAddClick }>+ Add another</button>
    }
    { props.removeButtonHidden
      || <button className="btn btn-sm btn-remove-another"
                 onClick={ handleRemoveClick }><FontAwesomeIcon icon={trashIcon} /></button>
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
  resourceKey: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
  const resourceTemplateId = ownProps.reduxPath.slice(-1)[0]
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const resourceLabel = resourceTemplate.resourceLabel
  const resourceKey = ownProps.reduxPath.slice(2, 3)[0]
  return {
    resourceLabel,
    resourceKey,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ addResource, removeResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PropertyActionButtons)
