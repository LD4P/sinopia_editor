import React from 'react'
import PanelResourceNavItem from './PanelResourceNavItem'
import PanelResourceTopNavItem from './PanelResourceTopNavItem'
import { selectProperty } from 'selectors/resources'
import { useSelector } from 'react-redux'
import PanelResourceSubjectNavItem from './PanelResourceSubjectNavItem'
import PropTypes from 'prop-types'
import _ from 'lodash'

const PanelResourcePropertyNavItem = (props) => {
  const property = useSelector((state) => selectProperty(state, props.propertyKey))

  const hasValue = !_.isEmpty(property.values) && property.values.some((value) => value.literal || value.uri)

  const hasError = !_.isEmpty(property.errors)

  const navItems = []
  if (props.level === 1) {
    navItems.push(<PanelResourceTopNavItem
        key={property.key}
        resourceKey={property.resourceKey}
        componentKey={property.key}
        label={property.propertyTemplate.label}
        level={props.level}
        hasValue={hasValue}
        hasError={hasError} />)
  } else {
    navItems.push(<PanelResourceNavItem
        key={property.key}
        resourceKey={property.resourceKey}
        componentKey={property.key}
        label={property.propertyTemplate.label}
        level={props.level}
        hasValue={hasValue}
        hasError={hasError} />)
  }
  if (property.values) {
    property.values.forEach((value) => {
      if (value.valueSubject) { navItems.push(<PanelResourceSubjectNavItem
        key={value.valueSubject.key}
        subjectKey={value.valueSubject.key}
        level={props.level + 1} />) }
    })
  }
  return navItems
}

PanelResourcePropertyNavItem.propTypes = {
  propertyKey: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
}

export default PanelResourcePropertyNavItem
