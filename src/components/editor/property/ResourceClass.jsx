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

  const options = Object.keys(subjectTemplate.classes).map((clazz) => (
    <option key={clazz} value={clazz}>
      {classLabel(clazz)}
    </option>
  ))

  const handleChange = (event) => {
    event.preventDefault()
    if (!event.target.value || event.target.value === subjectTemplate.class)
      return
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

  // onBlur doesn't work correctly for multiselects, so using onChange.
  /* eslint-disable jsx-a11y/no-onchange */
  return (
    <div className="row mb-2">
      <label
        htmlFor={`class-select-${resource.key}`}
        className="col-sm-1 col-form-label"
      >
        Class
      </label>
      <div className="col-auto">
        <select
          className="form-select"
          multiple={true}
          id={`class-select-${resource.key}`}
          aria-label={`Select classes for ${subjectTemplate.label}`}
          data-testid={`Select classes for ${subjectTemplate.label}`}
          value={resource.classes}
          size={options.length}
          onChange={handleChange}
        >
          {options}
        </select>
      </div>
    </div>
  )
}

ResourceClass.propTypes = {
  resource: PropTypes.object.isRequired,
  readOnly: PropTypes.bool.isRequired,
}

export default ResourceClass
