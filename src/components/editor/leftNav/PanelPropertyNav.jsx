import React from "react"
import PropTypes from "prop-types"
import { setCurrentComponent } from "actions/index"
import { useDispatch, useSelector } from "react-redux"
import { displayResourceValidations } from "selectors/errors"
import { selectNormProperty } from "selectors/resources"
import { selectPropertyTemplate } from "selectors/templates"
import PresenceIndicator from "./PresenceIndicator"
import { selectModalType } from "selectors/modals"
import _ from "lodash"

const PanelPropertyNav = (props) => {
  const dispatch = useDispatch()
  const property = useSelector((state) =>
    selectNormProperty(state, props.propertyKey)
  )
  const propertyTemplate = useSelector((state) =>
    selectPropertyTemplate(state, property?.propertyTemplateKey)
  )

  const hasError = !_.isEmpty(property.descWithErrorPropertyKeys)
  const displayValidations = useSelector((state) =>
    displayResourceValidations(state, property?.rootSubjectKey)
  )
  const headingClassNames = ["left-nav-header"]
  if (displayValidations && hasError) headingClassNames.push("text-danger")

  const isModalOpen = useSelector((state) => selectModalType(state))

  if (!property) return null

  const handleClick = (property) => {
    if (isModalOpen) return // do not respond to clicks in the nav if any modal is open

    dispatch(
      setCurrentComponent(
        property.rootSubjectKey,
        property.rootPropertyKey,
        property.key
      )
    )
  }

  return (
    <li>
      <button
        type="button"
        className="btn btn-link"
        aria-label={`Go to ${propertyTemplate.label}`}
        data-testid={`Go to ${propertyTemplate.label}`}
        onClick={() => handleClick(property)}
      >
        <h5 className={headingClassNames.join(" ")}>
          {propertyTemplate.label}
        </h5>
        <PresenceIndicator valueKeys={property.descUriOrLiteralValueKeys} />
      </button>
    </li>
  )
}

PanelPropertyNav.propTypes = {
  propertyKey: PropTypes.string.isRequired,
}

export default PanelPropertyNav
