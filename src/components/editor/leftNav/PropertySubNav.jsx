import React from "react"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import { displayResourceValidations } from "selectors/errors"
import { selectNormProperty, selectNormValues } from "selectors/resources"
import { selectPropertyTemplate } from "selectors/templates"
import SubjectSubNav from "./SubjectSubNav"
import PresenceIndicator from "./PresenceIndicator"
import useLeftNav from "hooks/useLeftNav"
import _ from "lodash"

const PropertySubNav = (props) => {
  const property = useSelector((state) => selectNormProperty(state, props.propertyKey))
  const propertyTemplate = useSelector((state) => selectPropertyTemplate(state, property?.propertyTemplateKey))
  const values = useSelector((state) => selectNormValues(state, property?.valueKeys))

  const { handleNavClick } = useLeftNav(property)

  const hasError = !_.isEmpty(property.descWithErrorPropertyKeys)
  const displayValidations = useSelector((state) => displayResourceValidations(state, property?.rootSubjectKey))
  const headingClassNames = ["left-nav-header"]
  if (displayValidations && hasError) headingClassNames.push("text-danger")

  const subNavForProperty = () => {
    if (_.isEmpty(values) || propertyTemplate.type !== "resource") return []

    const subNavItems = values.map((value) => {
      ;<SubjectSubNav key={value.valueSubjectKey} subjectKey={value.valueSubjectKey} />
    })
    return <ul>{subNavItems}</ul>
  }

  return (
    <li>
      <button
        type="button"
        className="btn property-nav"
        aria-label={`Go to ${propertyTemplate.label}`}
        data-testid={`Go to ${propertyTemplate.label}`}
        onClick={handleNavClick}
      >
        <span className={headingClassNames.join(" ")}>{propertyTemplate.label}</span>
      </button>
      <PresenceIndicator valueKeys={property.descUriOrLiteralValueKeys} />
      {subNavForProperty()}
    </li>
  )
}

PropertySubNav.propTypes = {
  propertyKey: PropTypes.string.isRequired,
}

export default PropertySubNav
