import React from 'react'
import PropTypes from 'prop-types'
import { setCurrentComponent } from 'actions/index'
import { useDispatch, useSelector } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import { selectSubject } from 'selectors/resources'
import PropertySubNav from './PropertySubNav'
import _ from 'lodash'

const SubjectSubNav = (props) => {
  const dispatch = useDispatch()

  const subject = useSelector((state) => selectSubject(state, props.subjectKey))

  const hasValue = !_.isEmpty(subject.descUriOrLiteralValueKeys)
  const liClassNames = hasValue ? 'li-checked' : ''

  const hasError = !_.isEmpty(subject.descWithErrorPropertyKeys)
  const displayValidations = useSelector((state) => displayResourceValidations(state))
  const headingClassNames = ['left-nav-header']
  if (displayValidations && hasError) headingClassNames.push('text-danger')

  const subNavForSubject = (subNavSubj) => {
    if (_.isEmpty(subNavSubj.properties)) return []
    const subNavItems = []

    subNavSubj.properties.forEach((subNavProp) => {
      subNavItems.push(<PropertySubNav key={subNavProp.key} propertyKey={subNavProp.key} />)
    })
    return (<ul>{subNavItems}</ul>)
  }
  const subNavItems = subNavForSubject(subject)

  return (<li className={liClassNames}>
    <button
              type="button"
              className="btn btn-link"
              aria-label={`Go to ${subject.subjectTemplate.label}`}
              data-testid={`Go to ${subject.subjectTemplate.label}`}
              onClick={() => dispatch(setCurrentComponent(subject.rootSubjectKey, subject.rootPropertyKey, subject.key))}>
      <span className={headingClassNames.join(' ')}>{subject.subjectTemplate.label}</span>
    </button>
    {subNavItems}
  </li>)
}

SubjectSubNav.propTypes = {
  subjectKey: PropTypes.string.isRequired,
}

export default SubjectSubNav
