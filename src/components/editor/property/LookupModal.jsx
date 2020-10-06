// Copyright 2020 Stanford University see LICENSE for license

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { newUriValue, newLiteralValue } from 'utilities/valueFactory'
import { addProperty } from 'actions/resources'
import { hideModal } from 'actions/modals'
import { selectNormValues } from 'selectors/resources'
import { isValidURI } from 'utilities/Utilities'
import LookupTabs from './LookupTabs'

const LookupModal = (props) => {
  const dispatch = useDispatch()
  const values = useSelector((state) => selectNormValues(state, props.property.valueKeys))

  const [query, setQuery] = useState('')

  const addUriOrLiteral = () => {
    if (!query) return
    const item = {}
    let typeOf = 'Literal'
    if (isValidURI(query)) {
      item.uri = query
      item.label = query
      typeOf = 'URI'
    } else {
      item.content = query
    }
    const ariaLabel = `Add as new ${typeOf}`
    return (<button onClick={() => selectionChanged(item)}
                    aria-label={ariaLabel}
                    className="btn search-result">
      <strong>New {typeOf}:</strong> {query}</button>
    )
  }

  const selectionChanged = (item) => {
    dispatch(hideModal())
    const newProperty = { ...props.property, values }
    if (item.uri) {
      newProperty.values.push(newUriValue(props.property, item.uri, item.label))
    } else {
      newProperty.values.push(newLiteralValue(props.property, item.content, null))
    }
    dispatch(addProperty(newProperty))
  }

  const classes = ['modal', 'fade']
  let display = 'none'

  if (props.show) {
    classes.push('show')
    display = 'block'
  }

  const close = (event) => {
    dispatch(hideModal())
    event.preventDefault()
  }

  return (
    <div className={ classes.join(' ') }
         id={ props.modalId }
         style={{ display }}>
      <div className="modal-dialog modal-dialog-scrollable" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <div className="form-group">
              <label htmlFor="search">{props.propertyTemplate.label}</label>
              <input id="search" type="search" className="form-control"
                     onKeyUp={(e) => setQuery(e.target.value)}></input>
              {addUriOrLiteral()}
            </div>

            <button type="button" className="close" onClick={close} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body lookup-search-results">
            <LookupTabs authorityConfigs={props.propertyTemplate.authorities} query={query} handleSelectionChanged={selectionChanged}/>
          </div>
          <div className="modal-footer">
            <button className="btn btn-link" onClick={ close }>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

LookupModal.propTypes = {
  modalId: PropTypes.string,
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  show: PropTypes.bool,
}


export default LookupModal
