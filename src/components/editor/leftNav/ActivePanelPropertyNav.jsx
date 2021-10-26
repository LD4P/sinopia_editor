import React from "react"
import PropTypes from "prop-types"
import { useSelector, shallowEqual } from "react-redux"
import { displayResourceValidations } from "selectors/errors"
import { selectNormProperty, selectNormValues } from "selectors/resources"
import { selectPropertyTemplate } from "selectors/templates"
import SubjectSubNav from "./SubjectSubNav"
import PresenceIndicator from "./PresenceIndicator"
import ToggleButton from "../ToggleButton"
import useLeftNav from "hooks/useLeftNav"
import _ from "lodash"
import useNavLink from "hooks/useNavLink"

// This draws a link for the left side navbar
const ActivePanelPropertyNav = (props) => {
  const property = useSelector((state) =>
    selectNormProperty(state, props.propertyKey)
  )
  const values = useSelector(
    (state) => selectNormValues(state, property.valueKeys),
    shallowEqual
  )
  const propertyTemplate = useSelector((state) =>
    selectPropertyTemplate(state, property?.propertyTemplateKey)
  )
  const displayValidations = useSelector((state) =>
    displayResourceValidations(state, property?.rootSubjectKey)
  )

  const { handleToggleClick, isExpanded } = useLeftNav(property)
  const { navLinkId, isCurrentProperty, handleNavLinkClick } =
    useNavLink(property)

  const liClassNames = []

  if (props.isTemplate) liClassNames.push("template")

  const hasError = !_.isEmpty(property.descWithErrorPropertyKeys)
  const headingClassNames = ["left-nav-header"]
  if (displayValidations && hasError) headingClassNames.push("text-danger")

  if (!property) return null

  let subNavForProperty
  if (!_.isEmpty(values) && propertyTemplate.type === "resource") {
    const subNavItems = values.map((value) => (
      <SubjectSubNav
        key={value.valueSubjectKey}
        subjectKey={value.valueSubjectKey}
      />
    ))
    subNavForProperty = <ul>{subNavItems}</ul>
  }

  const buttonClasses = ["d-inline-flex", "property-nav"]
  if (isCurrentProperty) buttonClasses.push("current")

  const toggleLabel = isExpanded
    ? `Hide navigation for ${propertyTemplate.label}`
    : `Show navigation for ${propertyTemplate.label}`

  // Render this property and any children value subjects (if a property type = resource).
  return (
    <li className={liClassNames.join(" ")} id={navLinkId}>
      {subNavForProperty && (
        <ToggleButton
          handleClick={handleToggleClick}
          isExpanded={isExpanded}
          label={toggleLabel}
        />
      )}
      <button
        type="button"
        className={buttonClasses.join(" ")}
        aria-label={`Go to ${propertyTemplate.label}`}
        data-testid={`Go to ${propertyTemplate.label}`}
        onClick={handleNavLinkClick}
      >
        <h5 className={headingClassNames.join(" ")}>
          {propertyTemplate.label}
        </h5>
        <PresenceIndicator valueKeys={property.descUriOrLiteralValueKeys} />
      </button>
      {isExpanded && subNavForProperty}
    </li>
  )
}

ActivePanelPropertyNav.propTypes = {
  propertyKey: PropTypes.string.isRequired,
  isTemplate: PropTypes.bool,
}

export default ActivePanelPropertyNav
