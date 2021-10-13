import React from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import { displayResourceValidations } from "selectors/errors"
import { selectNormSubject } from "selectors/resources"
import { selectSubjectTemplate } from "selectors/templates"
import PropertySubNav from "./PropertySubNav"
import PresenceIndicator from "./PresenceIndicator"
import useLeftNav from "hooks/useLeftNav"
import _ from "lodash"

const SubjectSubNav = (props) => {
  const subject = useSelector((state) =>
    selectNormSubject(state, props.subjectKey)
  )
  const subjectTemplate = useSelector((state) =>
    selectSubjectTemplate(state, subject?.subjectTemplateKey)
  )

  const handleClick = useLeftNav(subject)

  const hasError = !_.isEmpty(subject.descWithErrorPropertyKeys)
  const displayValidations = useSelector((state) =>
    displayResourceValidations(state, subject?.rootSubjectKey)
  )
  const headingClassNames = ["left-nav-header"]
  if (displayValidations && hasError) headingClassNames.push("text-danger")

  const subNavForSubject = () => {
    if (_.isEmpty(subject.propertyKeys)) return []
    const subNavItems = []

    subject.propertyKeys.forEach((propertyKey) => {
      subNavItems.push(
        <PropertySubNav key={propertyKey} propertyKey={propertyKey} />
      )
    })
    return <ul>{subNavItems}</ul>
  }

  if (!subject) return null

  return (
    <li>
      <button
        type="button"
        className="btn btn-link"
        aria-label={`Go to ${subjectTemplate.label}`}
        data-testid={`Go to ${subjectTemplate.label}`}
        onClick={handleClick}
      >
        <span className={headingClassNames.join(" ")}>
          {subjectTemplate.label}
        </span>
      </button>
      <PresenceIndicator valueKeys={subject.descUriOrLiteralValueKeys} />
      {subNavForSubject()}
    </li>
  )
}

SubjectSubNav.propTypes = {
  subjectKey: PropTypes.string.isRequired,
}

export default SubjectSubNav
