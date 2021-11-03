import React, { useRef, useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector, shallowEqual } from "react-redux"
import PropTypes from "prop-types"
import { updateURIValue, removeValue } from "actions/resources"
import { fetchLookup } from "actionCreators/lookups"
import { selectLookup } from "selectors/lookups"
import RemoveButton from "./RemoveButton"
import ValuePropertyURI from "../property/ValuePropertyURI"
import _ from "lodash"

const InputListValue = ({
  value,
  propertyTemplate,
  displayValidations,
  shouldFocus,
}) => {
  const dispatch = useDispatch()
  const inputLiteralRef = useRef(null)
  const [focusHasBeenSet, setFocusHasBeenSet] = useState(false)
  const id = `inputlist-${value.key}`

  // Map of authority URIs to authority values
  const authorityMap = useSelector((state) => {
    const newAuthorityMap = {}
    propertyTemplate.authorities.forEach((authority) => {
      newAuthorityMap[authority.uri] = selectLookup(state, authority.uri)
    })
    return newAuthorityMap
  }, shallowEqual)

  // Map of URIs to authority items
  const itemMap = useMemo(() => {
    const newItemMap = {}
    Object.values(authorityMap).forEach((items) => {
      Array.from(items || []).forEach((item) => {
        newItemMap[item.uri] = item
      })
    })
    return newItemMap
  }, [authorityMap])

  useEffect(() => {
    if (focusHasBeenSet && shouldFocus) {
      inputLiteralRef.current.focus()
      setFocusHasBeenSet(true)
    }
  }, [focusHasBeenSet, shouldFocus])

  // Retrieve the lookups
  useEffect(() => {
    propertyTemplate.authorities.forEach((authority) => {
      dispatch(fetchLookup(authority.uri))
    })
  }, [dispatch, propertyTemplate.authorities])

  const handleRemoveClick = (event) => {
    dispatch(removeValue(value.key))
    event.preventDefault()
  }

  const handleChange = (event) => {
    const item = itemMap[event.target.value]
    if (item)
      dispatch(
        updateURIValue(value.key, item.uri, item.label, null, "InputURIValue")
      )
    event.preventDefault()
  }

  const options = useMemo(() => {
    const newOptions = []
    propertyTemplate.authorities.forEach((authority) => {
      newOptions.push(<optgroup key={authority.uri} label={authority.label} />)
      const items = authorityMap[authority.uri] || []
      items.forEach((item) => {
        newOptions.push(
          <option key={`${authority.uri}-${item.uri}`} value={item.uri}>
            {item.label}
          </option>
        )
      })
    })
    return newOptions
  }, [authorityMap, propertyTemplate.authorities])

  const controlClasses = ["form-select"]
  if (displayValidations && !_.isEmpty(value.errors))
    controlClasses.push("is-invalid")

  const authorityLabels = propertyTemplate.authorities.map(
    (authority) => authority.label
  )

  return (
    <React.Fragment>
      <ValuePropertyURI propertyTemplate={propertyTemplate} value={value} />
      <div className="row my-2">
        <div className="col">
          <select
            id={id}
            className={controlClasses.join(" ")}
            aria-label={`Select ${propertyTemplate.label}`}
            data-testid={`Select ${propertyTemplate.label}`}
            value="default"
            onChange={handleChange}
            onBlur={handleChange}
          >
            <option value="default">{`Select ${propertyTemplate.label}`}</option>
            {options}
          </select>
          <div className="invalid-feedback">{value.errors.join(", ")}</div>
        </div>
        <div className="col-sm-1">
          <RemoveButton
            content={`select ${propertyTemplate.label}`}
            handleClick={handleRemoveClick}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-text mt-0 mb-2">
            Select from: {authorityLabels.join(", ")}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

InputListValue.propTypes = {
  value: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  displayValidations: PropTypes.bool.isRequired,
  shouldFocus: PropTypes.bool.isRequired,
}

export default InputListValue
