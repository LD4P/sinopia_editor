// Copyright 2019 Stanford University see LICENSE for license

import PropTypes from 'prop-types'
import React from 'react'
import { useSelector } from 'react-redux'
import { findErrors } from 'selectors/resourceSelectors'
import { generateMD5 } from 'Utilities'
import Alert from './Alert'

const Alerts = (props) => {
  const errors = useSelector(state => findErrors(state, props.errorKey))
  if (!errors || errors.length === 0) {
    return null
  }

  const alerts = errors.map(error => (<Alert text={error} key={`${props.errorKey}-${generateMD5(error)}`} />))

  return (
    <div id={`alerts-${props.errorKey}`}>
      {alerts}
    </div>
  )
}

Alerts.propTypes = {
  errorKey: PropTypes.string,
}

export default Alerts
