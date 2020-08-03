import React from 'react'
import PropTypes from 'prop-types'
import { setCurrentComponent } from 'actions/index'
import { useDispatch, useSelector } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import { selectCurrentComponentKey } from 'selectors/index'

const PanelResourceNavItem = (props) => {
  const dispatch = useDispatch()

  const classNames = ['list-group-item', 'list-group-item-action']
  const currentComponentKey = useSelector((state) => selectCurrentComponentKey(state, props.resourceKey))
  if (props.componentKey === currentComponentKey) classNames.push('active')
  if (props.hasValue) classNames.push('list-group-item-success')
  const displayValidations = useSelector((state) => displayResourceValidations(state))
  if (displayValidations && props.hasError) classNames.push('list-group-item-danger')

  const prefix = '\u00A0'.repeat(props.level * 2)
  return (<a
    className={classNames.join(' ')}
    onClick={() => dispatch(setCurrentComponent(props.resourceKey, props.componentKey))}>{prefix}{props.labelPrefix} {props.label}</a>)
}

PanelResourceNavItem.propTypes = {
  resourceKey: PropTypes.string.isRequired,
  componentKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  labelPrefix: PropTypes.string,
  hasValue: PropTypes.bool,
  hasError: PropTypes.bool,
}

export default PanelResourceNavItem
