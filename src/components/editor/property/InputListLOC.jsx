// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useState, useEffect, useMemo, useRef,
} from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import defaultFilterBy from 'react-bootstrap-typeahead/lib/utils/defaultFilterBy'
import PropTypes from 'prop-types'
import { selectModalType } from 'selectors/modals'
import { connect, useDispatch, useSelector } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import { renderMenuFunc, renderTokenFunc, itemsForValues } from './renderTypeaheadFunctions'
import { fetchLookup } from 'actionCreators/lookups'
import { selectLookup } from 'selectors/lookups'
import _ from 'lodash'
import { addProperty, removeValue } from 'actions/resources'
import { newUriValue, newLiteralValue } from 'utilities/valueFactory'
import { bindActionCreators } from 'redux'
import ModalWrapper from 'components/ModalWrapper'
import { hideModal, showModal } from 'actions/modals'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { selectNormValues } from 'selectors/resources'


// propertyTemplate of type 'lookup' does live QA lookup via API
//  based on URI in propertyTemplate.valueConstraint.useValuesFrom,
//  and the lookupConfig for the URI has component value of 'list'
const InputListLOC = (props) => {
  const dispatch = useDispatch()

  const typeAheadRef = useRef(null)

  const allAuthorities = useMemo(() => {
    const authorities = {}
    props.propertyTemplate.authorities.forEach((authority) => authorities[authority.uri] = authority)
    return authorities
  }, [props.propertyTemplate.authorities])
  const [selectedAuthorities, setSelectedAuthorities] = useState({})

  useEffect(() => {
    setSelectedAuthorities(allAuthorities)
  }, [allAuthorities])

  const isRepeatable = props.propertyTemplate.repeatable

  useEffect(() => {
    props.propertyTemplate.authorities.forEach((authority) => {
      dispatch(fetchLookup(authority.uri))
    })
  }, [dispatch, props.propertyTemplate.authorities])

  const authorities = useSelector((state) => {
    const newAuthorities = {}
    props.propertyTemplate.authorities.forEach((authority) => {
      newAuthorities[authority.uri] = selectLookup(state, authority.uri) || []
    })
    return newAuthorities
  })

  // Only update options when lookups or lookupConfigs change.
  const options = useMemo(() => {
    const newOptions = []
    Object.values(selectedAuthorities).forEach((authority) => {
      newOptions.push({ authLabel: authority.label, authURI: authority.uri })
      newOptions.push(...authorities[authority.uri] || [])
    })
    return newOptions
  }, [authorities, selectedAuthorities])

  const selected = itemsForValues(props.lookupValues)

  // From https://github.com/ericgio/react-bootstrap-typeahead/issues/389
  const onKeyDown = (e) => {
    // 8 = backspace
    if (e.keyCode === 8
        && e.target.value === '') {
      // Don't trigger a "back" in the browser on backspace
      e.returnValue = false
      e.preventDefault()
    }
  }

  const selectionChanged = (items) => {
    const newProperty = { ...props.property }
    if (_.isEmpty(items)) {
      newProperty.values = []
    } else {
      newProperty.values = items.map((item) => {
        if (item.uri) {
          return newUriValue(props.property, item.uri, item.label)
        }
        return newLiteralValue(props.property, item.content, null)
      })
    }
    dispatch(addProperty(newProperty))
  }

  const lookupCheckboxes = props.propertyTemplate.authorities.map((authority) => {
    const id = `${props.property.key}-${authority.uri}`
    return (
      <div key={authority.uri} className="form-check">
        <input className="form-check-input"
               type="checkbox" id={id}
               checked={!!selectedAuthorities[authority.uri]}
               onChange={() => toggleLookup(authority.uri)} />
        <label className="form-check-label" htmlFor={id}>
          {authority.label}
        </label>
      </div>
    ) })

  // Custom filterBy to retain authority labels when filtering to provide context.
  const filterBy = (option, props) => {
    if (option.authURI || option.isError) {
      return true
    }
    props.filterBy = ['label']
    return defaultFilterBy(option, props)
  }

  const toggleLookup = (uri) => {
    const newSelectedAuthorities = { ...selectedAuthorities }
    if (newSelectedAuthorities[uri]) {
      delete newSelectedAuthorities[uri]
    } else {
      newSelectedAuthorities[uri] = allAuthorities[uri]
    }
    setSelectedAuthorities(newSelectedAuthorities)
    typeAheadRef.current.getInstance().getInput().click()
  }


  const displayValidations = useSelector((state) => displayResourceValidations(state, props.property.rootSubjectKey))
  const validationErrors = props.property.errors

  const isDisabled = selected?.length > 0 && !isRepeatable

  let error
  let groupClasses = 'form-group'
  const classes = ['modal', 'fade']
  let display = 'none'
  const modalId = `InputLookupModal-${props.property.key}`

  if (displayValidations && !_.isEmpty(validationErrors)) {
    groupClasses += ' has-error'
    error = validationErrors.join(',')
  }

  if (props.show) {
    classes.push('show')
    display = 'block'
  }

  const handleClick = (event) => {
    event.preventDefault()
    dispatch(showModal(modalId))
  }

  const close = (event) => {
    props.hideModal()
    event.preventDefault()
  }

  // TODO: New styling to fit description in #2478
  const lookupSelection = props.lookupValues.map((lookupValue) => (
    <div key={lookupValue.key} className="lookup-value">
      <span key={lookupValue.key}>{lookupValue.label || lookupValue.literal}</span>
      <button
        onClick={() => props.removeValue(lookupValue.key)}
        aria-label={`Remove ${lookupValue.label}`}
        data-testid={`Remove ${lookupValue.label}`}
        className="close rbt-close rbt-token-remove-button">
        <span aria-hidden="true"><FontAwesomeIcon className="trash-icon" icon={faTrashAlt} /></span>
      </button>
      <a href={lookupValue.uri}>
        <span aria-hidden="true"><FontAwesomeIcon className="globe-icon" icon={faGlobe} /></span>
      </a>
    </div>
  ))

  const modal = (
    <div className={ classes.join(' ') }
         id={ modalId }
         style={{ display }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Lookup</h4>
          </div>
          <div className="modal-body">
            {lookupCheckboxes.length > 1 && lookupCheckboxes}
            <div className={groupClasses}>
              <Typeahead
                renderMenu={(results, menuProps) => renderMenuFunc(results, menuProps, Object.values(selectedAuthorities))}
                renderToken={(option, props, idx) => renderTokenFunc(option, props, idx)}
                allowNew={() => true }
                onChange={(selected) => selectionChanged(selected)}
                id="loc-vocab-list"
                multiple={true}
                placeholder={props.propertyTemplate.label}
                emptyLabel="retrieving list of terms..."
                useCache={true}
                selectHintOnEnter={true}
                options={options}
                selected={selected}
                filterBy={filterBy}
                onKeyDown={onKeyDown}
                disabled={isDisabled}
                ref={(ref) => typeAheadRef.current = ref}
              />
              {error && <span className="text-danger">{error}</span>}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-link" onClick={ close }>Cancel</button>
            <button className="btn btn-primary" onClick={ close } data-testid={`submit-${props.textValue}`}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <React.Fragment>
      <button
        id="lookup"
        onClick={ handleClick }
        aria-label={'LookupLOC'}
        className="btn btn-sm btn-secondary btn-literal">
        +
      </button>
      { lookupSelection }
      <ModalWrapper modal={modal} />
    </React.Fragment>
  )
}

InputListLOC.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  show: PropTypes.bool,
  hideModal: PropTypes.func,
  showModal: PropTypes.func,
  textValue: PropTypes.string,
  lookupValues: PropTypes.array,
  removeValue: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const show = selectModalType(state) === `InputLookupModal-${ownProps.property.key}`
  return {
    lookupValues: selectNormValues(state, ownProps.property?.valueKeys),
    show,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ hideModal, removeValue }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputListLOC)
