// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import NestedProperty from './NestedProperty'
import NestedResourceActionButtons from './NestedResourceActionButtons'
import { selectValue } from 'selectors/resources'
import { connect } from 'react-redux'
import useNavigableComponent from 'hooks/useNavigableComponent'

// AKA a value subject.
const NestedResource = (props) => {
  const [navEl, navClickHandler] = useNavigableComponent(props.value.valueSubject.resourceKey, props.value.valueSubject.key)

  // onClick is to support left navigation, so ignoring jsx-ally seems reasonable.
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div ref={navEl} onClick={navClickHandler}>
      <div className="row" key={props.valueKey}>
        <section className="col-md-6">
          <h5>{ props.value.valueSubject.subjectTemplate.label }</h5>
        </section>
        <section className="col-md-6">
          <NestedResourceActionButtons value={props.value} />
        </section>
      </div>
      <div>
        {
          props.value.valueSubject.propertyKeys.map((propertyKey) => (
            <NestedProperty key={propertyKey} propertyKey={propertyKey} />
          ))
        }
      </div>
    </div>
  )
}

NestedResource.propTypes = {
  valueKey: PropTypes.string.isRequired,
  value: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => ({
  value: selectValue(state, ourProps.valueKey),
})

export default connect(mapStateToProps)(NestedResource)
