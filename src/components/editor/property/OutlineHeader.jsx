// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import PropertyLabel from './PropertyLabel'

const OutlineHeader = (props) => {
  const icon = props.collapsed === true ? faPlusSquare : faMinusSquare

  let unicodeSpacer = ''
  for (let i = 0; i <= props.spacer; i++) {
    unicodeSpacer += '\u00a0'
  }

  if (props.isAdd) {
    return (
      <div className="rOutline-header">
        {unicodeSpacer}
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={props.handleCollapsed} data-id={props.id}>
          <FontAwesomeIcon icon={icon} />&nbsp;Add
        </button>
        <PropertyLabel pt={props.pt} />
      </div>
    )
  }
  return (
    <div className="rOutline-header">
      {unicodeSpacer}
      <a href="#" type="button" onClick={props.handleCollapsed} data-id={props.id}>
        <FontAwesomeIcon icon={icon} />&nbsp;
      </a>
      <PropertyLabel pt={props.pt} />
    </div>
  )
}

OutlineHeader.propTypes = {
  collapsed: PropTypes.any,
  handleCollapsed: PropTypes.func,
  id: PropTypes.string,
  isRequired: PropTypes.any,
  isAdd: PropTypes.bool,
  pt: PropTypes.object,
  spacer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default OutlineHeader
