import React from 'react'
import PanelResourceNavItem from './PanelResourceNavItem'
import PanelResourcePropertyNavItem from './PanelResourcePropertyNavItem'
import { selectSubject } from 'selectors/resources'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

const PanelResourceSubjectNavItem = (props) => {
  const subject = useSelector((state) => selectSubject(state, props.subjectKey))

  const navItems = []
  if (props.level > 0) {
    navItems.push(<PanelResourceNavItem
      key={subject.key}
      resourceKey={subject.resourceKey}
      componentKey={subject.key}
      label={subject.subjectTemplate.label}
      level={props.level} />)
  }
  subject.properties.forEach((property) => {
    if (props.level > 0 && !property.valueKeys) return
    navItems.push(<PanelResourcePropertyNavItem key={property.key} propertyKey={property.key} level={props.level + 1} />)
  })
  return navItems
}

PanelResourceSubjectNavItem.propTypes = {
  subjectKey: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
}

export default PanelResourceSubjectNavItem
