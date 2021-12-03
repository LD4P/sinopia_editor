import React from "react"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import { selectSubjectTemplate } from "selectors/templates"
import { setClasses } from "actions/resources"
import _ from "lodash"

const ResourceClass = ({ resource, readOnly }) => {
  const dispatch = useDispatch()
  const subjectTemplate = useSelector((state) =>
    selectSubjectTemplate(state, resource?.subjectTemplateKey)
  )

  const classLabel = (clazz) => {
    const label = subjectTemplate.classes[clazz]
    return clazz === label ? clazz : `${label} (${clazz})`
  }

  if (Object.keys(subjectTemplate.classes).length === 1 || readOnly) {
    return (
      <span className="resource-class">
        Class: {classLabel(resource.classes[0])}
      </span>
    )
  }

  const handleCheckboxClick = (event) => {
    if (resource.classes.includes(event.target.value)) {
      dispatch(
        setClasses(
          resource.key,
          _.without(resource.classes, event.target.value)
        )
      )
    } else {
      dispatch(
        setClasses(resource.key, [...resource.classes, event.target.value])
      )
    }
  }

  const checkboxes = Object.keys(subjectTemplate.classes)
    .filter((clazz) => clazz !== subjectTemplate.class)
    .map((clazz) => {
      const id = `checkbox-${resource.key}-${clazz}`
      const label = classLabel(clazz)
      return (
        <div className="form-check" key={clazz}>
          <input
            className="form-check-input"
            type="checkbox"
            checked={resource.classes.includes(clazz)}
            value={clazz}
            onChange={handleCheckboxClick}
            aria-label={`Select ${label} as class for ${subjectTemplate.label}`}
            data-testid={`Select ${label} as class for ${subjectTemplate.label}`}
            id={id}
          />
          <label className="form-check-label" htmlFor={id}>
            {label}
          </label>
        </div>
      )
    })

  return (
    <React.Fragment>
      <div className="row mb-2">
        <div className="col-sm-2">Class</div>
        <div className="col-auto">{classLabel(subjectTemplate.class)}</div>
      </div>
      <div className="row mb-2">
        <div className="col-sm-2">Optional classes</div>
        <div className="col-auto">{checkboxes}</div>
      </div>
    </React.Fragment>
  )
}

ResourceClass.propTypes = {
  resource: PropTypes.object.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default ResourceClass
