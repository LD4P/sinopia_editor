import React from "react"
import PropTypes from "prop-types"
import { setCurrentComponent } from "actions/index"
import { useDispatch, useSelector } from "react-redux"
import { displayResourceValidations } from "selectors/errors"
import { selectNormProperty, selectNormValues } from "selectors/resources"
import { selectPropertyTemplate } from "selectors/templates"
import SubjectSubNav from "./SubjectSubNav"
import PresenceIndicator from "./PresenceIndicator"
import _ from "lodash"

const PropertySubNav = (props) => {
  const dispatch = useDispatch()

  const property = useSelector((state) =>
    selectNormProperty(state, props.propertyKey)
  )
  const propertyTemplate = useSelector((state) =>
    selectPropertyTemplate(state, property?.propertyTemplateKey)
  )
  const values = useSelector((state) =>
    selectNormValues(state, property?.valueKeys)
  )

  const hasError = !_.isEmpty(property.descWithErrorPropertyKeys)
  const displayValidations = useSelector((state) =>
    displayResourceValidations(state, property?.rootSubjectKey)
  )
  const headingClassNames = ["left-nav-header"]
  if (displayValidations && hasError) headingClassNames.push("text-danger")

  const subNavForProperty = () => {
    if (_.isEmpty(values) || propertyTemplate.type !== "resource") return []

    const subNavItems = values.map((value) => {
      ;<SubjectSubNav
        key={value.valueSubjectKey}
        subjectKey={value.valueSubjectKey}
      />
    })
    return <ul>{subNavItems}</ul>
  }

  if (!property || property.valueKeys === null) return null

  return (
    <li>
      <button
        type="button"
        className="btn btn-link"
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
        <span className={headingClassNames.join(" ")}>
          {propertyTemplate.label}
        </span>
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
