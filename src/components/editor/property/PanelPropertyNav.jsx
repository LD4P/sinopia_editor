import React from 'react'
import PropTypes from 'prop-types'
import { setCurrentComponent } from 'actions/index'
import { useDispatch, useSelector } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import { selectProperty } from 'selectors/resources'
import _ from 'lodash'

const PanelPropertyNav = (props) => {
  const dispatch = useDispatch()
  const property = useSelector((state) => selectProperty(state, props.propertyKey))

  const hasValue = !_.isEmpty(property.descUriOrLiteralValueKeys)
  const liClassNames = hasValue ? 'li-checked' : ''

  const hasError = !_.isEmpty(property.descWithErrorPropertyKeys)
  const displayValidations = useSelector((state) => displayResourceValidations(state))
  const headingClassNames = ['left-nav-header']
  if (displayValidations && hasError) headingClassNames.push('text-danger')

  return (<li className={liClassNames}>
    <button
              type="button"
              className="btn btn-link"
              aria-label={`Go to ${property.propertyTemplate.label}`}
              data-testid={`Go to ${property.propertyTemplate.label}`}
              onClick={() => dispatch(setCurrentComponent(property.rootSubjectKey, property.rootPropertyKey, property.key))}>
      <h5 className={headingClassNames.join(' ')}>
        {property.propertyTemplate.label}
      </h5>
    </button>
  </li>)
}

PanelPropertyNav.propTypes = {
  propertyKey: PropTypes.string.isRequired,
}

export default PanelPropertyNav
