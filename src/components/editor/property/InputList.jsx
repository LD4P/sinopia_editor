// Copyright 2018, 2019 Stanford University see LICENSE for license

import React, { useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect, useSelector, useDispatch } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import { selectCurrentResourceIsReadOnly, selectNormValues } from 'selectors/resources'
import InputValue from './InputValue'
import _ from 'lodash'
import { addValue } from 'actions/resources'
import { newUriValue } from 'utilities/valueFactory'
import { selectLookup } from 'selectors/lookups'
import { fetchLookup } from 'actionCreators/lookups'

const InputList = (props) => {
  const dispatch = useDispatch()

  const readOnly = useSelector((state) => selectCurrentResourceIsReadOnly(state))
  const disabled = readOnly || (!props.propertyTemplate.repeatable
                                && props.property.valueKeys.length > 0)

  // Map of authority URI to items
  const authorities = useSelector((state) => {
    const newAuthorities = {}
    props.propertyTemplate.authorities.forEach((authority) => {
      newAuthorities[authority.uri] = selectLookup(state, authority.uri) || []
    })
    return newAuthorities
  })

  // Map of authority URI to labels
  const authorityLabels = useMemo(() => {
    const newAuthorityLabels = {}
    props.propertyTemplate.authorities.forEach((authority) => {
      newAuthorityLabels[authority.uri] = authority.label
    })
    return newAuthorityLabels
  }, [props.propertyTemplate.authorities])

  // Map of lookup item URIs to labels
  const itemLabels = useMemo(() => {
    const newItemLabels = {}
    Object.values(authorities).forEach((items) => {
      items.forEach((item) => newItemLabels[item.uri] = item.label)
    })
    return newItemLabels
  }, [authorities])

  // Retrieve the lookups
  useEffect(() => {
    props.propertyTemplate.authorities.forEach((authority) => {
      dispatch(fetchLookup(authority.uri))
    })
  }, [dispatch, props.propertyTemplate.authorities])

  const options = useMemo(() => {
    const newOptions = [<option value="choose" key="choose">Choose...</option>]
    Object.keys(authorities).forEach((authorityUri) => {
      newOptions.push(<optgroup key={authorityUri} label={ authorityLabels[authorityUri] } />)
      authorities[authorityUri].forEach((item) => newOptions.push(<option key={item.uri} value={item.uri}>{item.label}</option>))
    })
    return newOptions
  }, [authorities, authorityLabels])

  const addedList = props.property.valueKeys.map((valueKey) => (<InputValue key={valueKey}
                                                                            valueKey={valueKey} />))

  let error
  let controlClasses = 'custom-select'
  if (props.displayValidations && !_.isEmpty(props.property.errors)) {
    controlClasses += ' is-invalid'
    error = props.property.errors.join(',')
  }

  const selectionChanged = (event) => {
    event.preventDefault()
    const uri = event.target.value
    if (uri === 'choose') return
    // Only add if not already added.
    if (props.values.some((value) => value.uri === uri)) return

    dispatch(addValue(newUriValue(props.property, uri, itemLabels[uri])))
  }

  return (
    <div className="form-group">
      <div className="input-group">
        <select
          className={controlClasses}
          value="choose"
          disabled={disabled}
          onChange={selectionChanged}
          onBlur={selectionChanged}
          aria-label={`Select ${props.propertyTemplate.label}`}
          data-testid="list"
          id={props.propertyLabelId}
        >{options}
        </select>
        {error && <span className="invalid-feedback">{error}</span>}
      </div>
      {addedList}
    </div>
  )
}

InputList.propTypes = {
  displayValidations: PropTypes.bool,
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  values: PropTypes.array,
  addValue: PropTypes.func,
  propertyLabelId: PropTypes.string.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  displayValidations: displayResourceValidations(state, ownProps.property?.rootSubjectKey),
  values: selectNormValues(state, ownProps.property.valueKeys),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ addValue }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputList)
