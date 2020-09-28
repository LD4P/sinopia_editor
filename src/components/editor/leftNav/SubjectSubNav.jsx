import React from 'react'
import PropTypes from 'prop-types'
import { setCurrentComponent } from 'actions/index'
import { useDispatch, useSelector } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import { selectNormSubject } from 'selectors/resources'
import { selectSubjectTemplate } from 'selectors/templates'
import PropertySubNav from './PropertySubNav'
import _ from 'lodash'

const SubjectSubNav = (props) => {
  const dispatch = useDispatch()
  const subject = useSelector((state) => selectNormSubject(state, props.subjectKey))
  const subjectTemplate = useSelector((state) => selectSubjectTemplate(state, subject?.subjectTemplateKey))

  const hasValue = !_.isEmpty(subject.descUriOrLiteralValueKeys)
  const liClassNames = hasValue ? 'li-checked' : ''

  const hasError = !_.isEmpty(subject.descWithErrorPropertyKeys)
  const displayValidations = useSelector((state) => displayResourceValidations(state, subject?.rootSubjectKey))
  const headingClassNames = ['left-nav-header']
  if (displayValidations && hasError) headingClassNames.push('text-danger')

  const subNavForSubject = () => {
    if (_.isEmpty(subject.propertyKeys)) return []
    const subNavItems = []

    subject.propertyKeys.forEach((propertyKey) => {
      subNavItems.push(<PropertySubNav key={propertyKey} propertyKey={propertyKey} />)
    })
    return (<ul>{subNavItems}</ul>)
  }

  if (!subject) return null

  return (<li className={liClassNames}>
    <button
              type="button"
              className="btn btn-link"
              aria-label={`Go to ${subjectTemplate.label}`}
              data-testid={`Go to ${subjectTemplate.label}`}
              onClick={() => dispatch(setCurrentComponent(subject.rootSubjectKey, subject.rootPropertyKey, subject.key))}>
      <span className={headingClassNames.join(' ')}>{subjectTemplate.label}</span>
    </button>
    { subNavForSubject() }
  </li>)
}

SubjectSubNav.propTypes = {
  subjectKey: PropTypes.string.isRequired,
}

export default SubjectSubNav
