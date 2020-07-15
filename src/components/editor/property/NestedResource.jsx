// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import NestedProperty from './NestedProperty'
import NestedResourceActionButtons from './NestedResourceActionButtons'
import { selectValue } from 'selectors/resources'
import { connect } from 'react-redux'

// AKA a value subject.
const NestedResource = (props) => (
  <div>
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

NestedResource.propTypes = {
  valueKey: PropTypes.string.isRequired,
  value: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => ({
  value: selectValue(state, ourProps.valueKey),
})

export default connect(mapStateToProps)(NestedResource)
