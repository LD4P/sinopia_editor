// Copyright 2020 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const Tabs = (props) => {
  const children = props.children

  const getDefaultActiveKey = () => {
    let defaultActiveKey
    React.Children.forEach(children, (child) => {
      if (defaultActiveKey == null) {
        defaultActiveKey = child.props.eventKey
      }
    })
    return defaultActiveKey
  }
  const activeKey = props.activeKey || getDefaultActiveKey()

  const renderTab = (child) => {
    const id = `${child.props.eventKey}-tab`
    const href = `#${child.props.eventKey}`
    let classes = 'nav-link'
    if (child.props.eventKey === activeKey) {
      classes += ' active'
    }
    const selected = child.props.eventKey === activeKey ? 'true' : 'false'

    return (
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

    return (
      <div className={classes} id={child.props.eventKey} role="tabpanel" aria-labelledby={labeler}>{child.props.children}</div>
    )
  }

  const chunkedChildren = _.chunk(React.Children.toArray(children), 2)

  const tabs = chunkedChildren.map((childPair) => (
    <div className="row" key={`${childPair[0].props.eventKey}-div`}>
      <div className="col-6">
        {renderTab(childPair[0])}
      </div>
      { childPair[1]
        && <div className="col-6">
          {renderTab(childPair[1])}
        </div>
      }
    </div>
  ))

  return (
    <React.Fragment>
      <ul className="nav nav-tabs" role="tablist">
        <div className="container">
          {tabs}
        </div>
      </ul>
      <div className="tab-content">
        {React.Children.map(children, renderPanel)}
      </div>
    </React.Fragment>
  )
}

Tabs.propTypes = {
  activeKey: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
}

export default Tabs
