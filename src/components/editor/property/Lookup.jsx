// Copyright 2020 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { newUriValue, newLiteralValue } from 'utilities/valueFactory'
import { addProperty } from 'actions/resources'
import { selectNormValues } from 'selectors/resources'
import { isValidURI } from 'utilities/Utilities'
import LookupTabs from './LookupTabs'
import _ from 'lodash'

const Lookup = (props) => {
  const dispatch = useDispatch()
  const values = useSelector((state) => selectNormValues(state, props.property.valueKeys))

  const addUriOrLiteral = () => {
    if (!props.query) return
    const item = {}
    let typeOf = 'literal'
    if (isValidURI(props.query)) {
      item.uri = props.query
      item.label = props.query
      typeOf = 'URI'
    } else {
      item.content = props.query
    }
    return (<button onClick={() => selectionChanged(item)}
                    aria-label={`Add as new ${typeOf}`}
                    className="btn search-result">
      <strong>Add new {typeOf}:</strong> {props.query}</button>
    )
  }

  const selectionChanged = (item) => {
    const newProperty = { ...props.property, values }
    if (item.uri) {
      newProperty.values.push(newUriValue(props.property, item.uri, item.label))
    } else {
      newProperty.values.push(newLiteralValue(props.property, item.content, null))
    }
    dispatch(addProperty(newProperty))
    props.onSelectionChanged()
  }

  if (!props.show || _.isEmpty(props.query)) return null

  return (
    <div className="container">

      <div className="row">
        <div className="col-11">
          {addUriOrLiteral()}
        </div>
        <section className="col-1">
          <button
            className="btn btn-lg"
            onClick={props.hideLookup}
            data-testid={`Close lookup for ${props.propertyTemplate.label}`}
            aria-label={`Close lookup for ${props.propertyTemplate.label}`}>&times;</button>
        </section>
      </div>
      <div className="row">
        <div className="col lookup-search-results">
          <LookupTabs
            authorityConfigs={props.propertyTemplate.authorities}
            query={props.query}
            handleSelectionChanged={selectionChanged}/>
        </div>
      </div>
    </div>
  )
}

Lookup.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  show: PropTypes.bool,
  query: PropTypes.string.isRequired,
  hideLookup: PropTypes.func.isRequired,
  onSelectionChanged: PropTypes.func.isRequired,
}

export default Lookup
