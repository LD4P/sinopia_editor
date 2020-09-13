// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PropertyLabel from './PropertyLabel'
import PropertyLabelInfo from './PropertyLabelInfo'
import PropertyComponent from './PropertyComponent'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { resourceEditErrorKey } from '../Editor'
import { expandProperty, contractProperty } from 'actionCreators/resources'
import { selectProperty, selectCurrentResourceKey } from 'selectors/resources'
import useNavigableComponent from 'hooks/useNavigableComponent'

const PanelProperty = (props) => {
  // Null values indicates that can be added.
  const isAdd = props.property.values === null
  const isRequired = props.property.propertyTemplate.required
  const nbsp = '\u00A0'
  const trashIcon = faTrashAlt
  const [navEl, navClickHandler] = useNavigableComponent(props.resourceKey, props.propertyKey)

  // onClick is to support left navigation, so ignoring jsx-ally seems reasonable.
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div ref={navEl} onClick={navClickHandler}>
      <div className="card" data-label={ props.property.propertyTemplate.label } style={{ marginBottom: '1em' }}>
        <div className="card-header prop-heading">
          <h5 className="card-title">
            <PropertyLabel propertyTemplate={ props.property.propertyTemplate } />
            <PropertyLabelInfo propertyTemplate={ props.property.propertyTemplate } />{nbsp}
            { isAdd && (
              <button
                  type="button"
                  className="btn btn-sm btn-add btn-add-instance pull-right"
                  onClick={() => props.expandProperty(props.property.key, resourceEditErrorKey(props.resourceKey))}
                  aria-label={`Add ${props.property.propertyTemplate.label}`}
                  data-testid={`Add ${props.property.propertyTemplate.label}`}
                  data-id={props.property.key}>
                + Add
              </button>
            )}
            { !isAdd && !isRequired && (
              <button type="button"
                      className="btn btn-sm btn-remove pull-right"
                      aria-label={`Remove ${props.property.propertyTemplate.label}`}
                      data-testid={`Remove ${props.property.propertyTemplate.label}`}
                      onClick={() => props.contractProperty(props.property.key)} data-id={props.id}>
                <FontAwesomeIcon className="fa-inverse trash-icon" icon={trashIcon} />
              </button>
            )}
          </h5>
        </div>
        { !isAdd && (
          <div className="card-body panel-property">
            <PropertyComponent property={ props.property } />
          </div>
        )}
      </div>
    </div>
  )
}

PanelProperty.propTypes = {
  float: PropTypes.number,
  id: PropTypes.string,
  property: PropTypes.object,
  propertyKey: PropTypes.string.isRequired,
  expandProperty: PropTypes.func,
  contractProperty: PropTypes.func,
  resourceKey: PropTypes.string,
}

const mapStateToProps = (state, ourProps) => ({
  property: selectProperty(state, ourProps.propertyKey),
  resourceKey: selectCurrentResourceKey(state),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ expandProperty, contractProperty }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PanelProperty)
