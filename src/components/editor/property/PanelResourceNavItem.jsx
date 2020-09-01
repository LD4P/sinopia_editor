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
  // Check or bullet
  const prefixMark = props.hasValue ? '\u2713' : '\u2022'
  const displayValidations = useSelector((state) => displayResourceValidations(state))
  if (displayValidations && props.hasError) classNames.push('text-danger')

  const prefix = '\u00A0'.repeat(props.level * 4)

  return (
    <button type="button"
            className={classNames.join(' ')}
            onClick={() => dispatch(setCurrentComponent(props.resourceKey, props.componentKey))}>
      {prefix}{prefixMark} {props.label}
    </button>
  )
}

PanelResourceNavItem.propTypes = {
  resourceKey: PropTypes.string.isRequired,
  componentKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  hasValue: PropTypes.bool,
  hasError: PropTypes.bool,
}

export default PanelResourceNavItem
