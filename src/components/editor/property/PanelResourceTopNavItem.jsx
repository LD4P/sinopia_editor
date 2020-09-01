import React from 'react'
import PropTypes from 'prop-types'
import { setCurrentComponent } from 'actions/index'
import { useDispatch, useSelector } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import { selectCurrentComponentKey } from 'selectors/index'

const PanelResourceTopNavItem = (props) => {
  const dispatch = useDispatch()

  const classNames = ['list-group-item', 'list-group-item-action', 'list-group-top-item']
  const currentComponentKey = useSelector((state) => selectCurrentComponentKey(state, props.resourceKey))
  if (props.componentKey === currentComponentKey) classNames.push('active')
  // Check or space
  const prefixMark = props.hasValue ? '\u2713' : '\u00A0\u00A0'
  const displayValidations = useSelector((state) => displayResourceValidations(state))
  if (displayValidations && props.hasError) classNames.push('text-danger')

  return (<button
    type="button"
    className={classNames.join(' ')}
    onClick={() => dispatch(setCurrentComponent(props.resourceKey, props.componentKey))}>
    <h5>
      {prefixMark} {props.label}
    </h5>
  </button>)
}

PanelResourceTopNavItem.propTypes = {
  resourceKey: PropTypes.string.isRequired,
  componentKey: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  hasValue: PropTypes.bool,
  hasError: PropTypes.bool,
}

export default PanelResourceTopNavItem
