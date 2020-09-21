import React from 'react'
import PropTypes from 'prop-types'
import { setCurrentComponent } from 'actions/index'
import { useDispatch, useSelector } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import { selectProperty } from 'selectors/resources'
import SubjectSubNav from './SubjectSubNav'
import _ from 'lodash'

const PropertySubNav = (props) => {
  const dispatch = useDispatch()

  const property = useSelector((state) => selectProperty(state, props.propertyKey))

  const hasValue = !_.isEmpty(property.descUriOrLiteralValueKeys)
  const className = hasValue ? 'li-checked' : ''

  const hasError = !_.isEmpty(property.descWithErrorPropertyKeys)
  const displayValidations = useSelector((state) => displayResourceValidations(state))
  const headingClassNames = ['left-nav-header']
  if (displayValidations && hasError) headingClassNames.push('text-danger')

  const subNavForProperty = (subNavProp) => {
    if (_.isEmpty(subNavProp.values) || subNavProp.propertyTemplate.type !== 'resource') return []
    const subNavItems = []

    subNavProp.values.forEach((subNavValue) => {
      const subNavSubject = subNavValue.valueSubject
      // const subjectSubNavItems = subNavForSubject(subNavSubject)
      subNavItems.push(<SubjectSubNav key={subNavSubject.key} subjectKey={subNavSubject.key} />)
    })

    return (<ul>{subNavItems}</ul>)
  }

  const subNavItems = subNavForProperty(property)

  if (property.values === null) return null

  return (<li className={className}>
    <button
              type="button"
              className="btn btn-link"
              aria-label={`Go to ${property.propertyTemplate.label}`}
              data-testid={`Go to ${property.propertyTemplate.label}`}
              onClick={() => dispatch(setCurrentComponent(property.rootSubjectKey, property.rootPropertyKey, property.key))}>
      <span className={headingClassNames.join(' ')}>{property.propertyTemplate.label}</span>
    </button>
    {subNavItems}
  </li>)
}

PropertySubNav.propTypes = {
  propertyKey: PropTypes.string.isRequired,
}

export default PropertySubNav
