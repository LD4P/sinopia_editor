import React from "react"
import PropTypes from "prop-types"
import { setCurrentComponent } from "actions/index"
import { useDispatch, useSelector } from "react-redux"
import { displayResourceValidations } from "selectors/errors"
import { selectNormProperty, selectNormValues } from "selectors/resources"
import { selectPropertyTemplate } from "selectors/templates"
import SubjectSubNav from "./SubjectSubNav"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons"
import _ from "lodash"

const ActivePanelPropertyNav = (props) => {
  const dispatch = useDispatch()
  const property = useSelector((state) =>
    selectNormProperty(state, props.propertyKey)
  )
  const values = useSelector((state) =>
    selectNormValues(state, property.valueKeys)
  )
  const propertyTemplate = useSelector((state) =>
    selectPropertyTemplate(state, property?.propertyTemplateKey)
  )

  const hasValue = !_.isEmpty(property.descUriOrLiteralValueKeys)
  const liClassNames = []

  if (props.isTemplate) liClassNames.push("template")

  const hasError = !_.isEmpty(property.descWithErrorPropertyKeys)
  const displayValidations = useSelector((state) =>
    displayResourceValidations(state, property?.rootSubjectKey)
  )
  const headingClassNames = ["left-nav-header"]
  if (displayValidations && hasError) headingClassNames.push("text-danger")

  const subNavForProperty = () => {
    if (_.isEmpty(values) || propertyTemplate.type !== "resource") return []

    const subNavItems = values.map((value) => (
      <SubjectSubNav
        key={value.valueSubjectKey}
        subjectKey={value.valueSubjectKey}
      />
    ))
    return <ul>{subNavItems}</ul>
  }

  if (!property) return null

  // Render this property and any children value subjects (if a property type = resource).
  return (
    <li className={liClassNames.join(" ")}>
      <button
        type="button"
        className="btn btn-primary"
        aria-label={`Go to ${propertyTemplate.label}`}
        data-testid={`Go to ${propertyTemplate.label}`}
        onClick={() =>
          dispatch(
            setCurrentComponent(
              property.rootSubjectKey,
              property.rootPropertyKey,
              property.key
            )
          )
        }
      >
        <h5 className={headingClassNames.join(" ")}>
          {propertyTemplate.label}
        </h5>
      </button>
      {hasValue && (<FontAwesomeIcon icon={faCircle} size="xs"/>)}
      {subNavForProperty()}
    </li>
  )
}

ActivePanelPropertyNav.propTypes = {
  propertyKey: PropTypes.string.isRequired,
  isTemplate: PropTypes.bool,
}

export default ActivePanelPropertyNav
