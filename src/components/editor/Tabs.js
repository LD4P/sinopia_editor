// Copyright 2020 Stanford University see LICENSE for license

import React, {
  useState, useRef, useMemo, useEffect,
} from 'react'
import PropTypes from 'prop-types'

export const Tabs = (props) => {
  const children = props.children

  const getDefaultActiveKey = (children) => {
    let defaultActiveKey;
    React.Children.forEach(props.children, (child) => {
      if (defaultActiveKey == null) {
        defaultActiveKey = child.props.eventKey
      }
    })
    return defaultActiveKey
  }
  const activeKey = props.activeKey || getDefaultActiveKey(children)

  const renderTab = (child) => {
    const id = `${child.props.eventKey}-tab`
    const href = `#${child.props.eventKey}`
    let classes = 'nav-link'
    if (child.props.eventKey === activeKey) {
      classes += ' active'
    }
    const selected = child.props.eventKey === activeKey ? 'true' : 'false'

    return(
      <li className="nav-item" role="presentation">
        <a className={classes} id={id} data-toggle="tab"
           href={href} role="tab" aria-controls={child.props.eventKey}
           onClick={() => props.onSelect(child.props.eventKey)}
           aria-selected={selected}>{child.props.title}</a>
      </li>
    )
  }

  const renderPanel = (child) => {
    const labeler = `${child.props.eventKey}-tab`
    let classes = 'tab-pane fade'
    if (child.props.eventKey === activeKey) {
      classes += ' show active'
    }

    return(
      <div className={classes} id={child.props.eventKey} role="tabpanel" aria-labelledby={labeler}>{child.props.children}</div>
    )
  }

  return (
    <React.Fragment>
      <ul className="nav nav-tabs" role="tablist">
        {React.Children.map(props.children, renderTab)}
      </ul>
      <div className="tab-content">
        {React.Children.map(props.children, renderPanel)}
      </div>
    </React.Fragment>
  )
}


Tabs.propTypes = {
  activeKey: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
}
