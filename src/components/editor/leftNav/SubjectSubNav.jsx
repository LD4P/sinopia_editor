import React from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import { displayResourceValidations } from "selectors/errors"
import { selectNormSubject } from "selectors/resources"
import { selectSubjectTemplate } from "selectors/templates"
import PropertySubNav from "./PropertySubNav"
import PresenceIndicator from "./PresenceIndicator"
import useLeftNav from "hooks/useLeftNav"
import ToggleButton from "../ToggleButton"
import _ from "lodash"
import useNavLink from "hooks/useNavLink"

const SubjectSubNav = (props) => {
  const subject = useSelector((state) =>
    selectNormSubject(state, props.subjectKey)
  )
  const subjectTemplate = useSelector((state) =>
    selectSubjectTemplate(state, subject?.subjectTemplateKey)
  )

  const { handleToggleClick, isExpanded } = useLeftNav(subject)
  const { navLinkId, handleNavLinkClick } = useNavLink(subject)

  const hasError = !_.isEmpty(subject.descWithErrorPropertyKeys)
  const displayValidations = useSelector((state) =>
    displayResourceValidations(state, subject?.rootSubjectKey)
  )
  const headingClassNames = ["left-nav-header"]
  if (displayValidations && hasError) headingClassNames.push("text-danger")

  let subNavForSubject
  if (!_.isEmpty(subject.propertyKeys)) {
    const subNavItems = subject.propertyKeys.map((propertyKey) => (
      <PropertySubNav key={propertyKey} propertyKey={propertyKey} />
    ))
    subNavForSubject = <ul>{subNavItems}</ul>
  }

  if (!subject) return null

  const toggleLabel = isExpanded
    ? `Hide navigation for ${subjectTemplate.label}`
    : `Show navigation for ${subjectTemplate.label}`

  return (
    <li id={navLinkId}>
      {subNavForSubject && (
        <ToggleButton
          handleClick={handleToggleClick}
          isExpanded={isExpanded}
          label={toggleLabel}
        />
      )}
      <button
        type="button"
        className="btn d-inline-flex property-nav"
        aria-label={`Go to ${subjectTemplate.label}`}
        data-testid={`Go to ${subjectTemplate.label}`}
        onClick={handleNavLinkClick}
      >
        <span className={headingClassNames.join(" ")}>
          {subjectTemplate.label}
        </span>
      </button>
      <PresenceIndicator valueKeys={subject.descUriOrLiteralValueKeys} />
      {isExpanded && subNavForSubject}
    </li>
  )
}

SubjectSubNav.propTypes = {
  subjectKey: PropTypes.string.isRequired,
}

export default SubjectSubNav
