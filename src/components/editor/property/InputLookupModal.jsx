// Copyright 2019 Stanford University see LICENSE for license

import React, {
  useState, useRef, useMemo, useEffect,
} from 'react'
import { Typeahead, asyncContainer } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { selectModalType } from 'selectors/modals'
import { connect, useSelector, useDispatch } from 'react-redux'
import { displayResourceValidations } from 'selectors/errors'
import _ from 'lodash'
import { renderMenuFunc, renderTokenFunc, itemsForProperty } from './renderTypeaheadFunctions'
import { newUriValue, newLiteralValue } from 'utilities/valueFactory'
import { addProperty } from 'actions/resources'
import { hideModal, showModal } from 'actions/modals'
import { bindActionCreators } from 'redux'
import ModalWrapper from 'components/ModalWrapper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faGlobe } from '@fortawesome/free-solid-svg-icons'

const AsyncTypeahead = asyncContainer(Typeahead)

const InputLookupModal = (props) => {
  const dispatch = useDispatch()
  const [, setTriggerRender] = useState('')
  // Using a ref so that can append to current list of results.
  const allResults = useRef([])
  // Tokens allow us to cancel an existing search. Does not actually stop the
  // search, but causes result to be ignored.
  const tokens = useRef([])

  const displayValidations = useSelector((state) => displayResourceValidations(state))
  const errors = props.property.errors
  const selected = itemsForProperty(props.property)
  const [query, setQuery] = useState(false)
  const typeAheadRef = useRef(null)

  const allAuthorities = useMemo(() => {
    const authorities = {}
    props.property.propertyTemplate.authorities.forEach((authority) => authorities[authority.uri] = authority)
    return authorities
  }, [props.property.propertyTemplate.authorities])

  const [selectedAuthorities, setSelectedAuthorities] = useState({})

  useEffect(() => {
    setSelectedAuthorities(allAuthorities)
  }, [allAuthorities])

  // For use inside the effect without having to add props to dependency array.
  const getLookupResults = props.getLookupResults
  useEffect(() => {
    if (!query) return
    // Clear the results.
    // No re-render, so change not visible to user.
    allResults.current = []

    // Cancel all current searches
    while (tokens.current.length > 0) {
      tokens.current.pop().cancel = true
    }

    // Create a token for this set of searches
    const token = { cancel: false }
    tokens.current.push(token)

    // resultPromises is an array of Promise<result>
    const resultPromises = getLookupResults(query, Object.values(selectedAuthorities))
    resultPromises.forEach((resultPromise) => {
      resultPromise.then((resultSet) => {
        // Only use these results if not cancelled.
        if (!token.cancel) {
          allResults.current.push(resultSet)
          // Changing state triggers re-render.
          setTriggerRender(resultSet)
        }
      })
    })
  }, [query, selectedAuthorities, getLookupResults])

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

  const isRepeatable = props.property.propertyTemplate.repeatable

  const isDisabled = selected?.length > 0 && !isRepeatable

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

  const lookupCheckboxes = Object.values(allAuthorities).map((authority) => {
    const id = `${props.property.key}-${authority.uri}`
    return (
      <div key={authority.uri} className="form-check">
        <input className="form-check-input"
               type="checkbox"
               id={id}
               checked={!!selectedAuthorities[authority.uri]}
               onChange={() => toggleLookup(authority.uri)} />
        <label className="form-check-label" htmlFor={id}>
          {authority.label}
        </label>
      </div>
    ) })

  const typeaheadProps = {
    id: 'lookupComponent',
    multiple: true,
    placeholder: props.property.propertyTemplate.label,
    useCache: true,
    selectHintOnEnter: true,
    isLoading: false,
    allowNew: true,
    delay: 300,
    onKeyDown,
  }

  let error
  let groupClasses = 'form-group'
  const classes = ['modal', 'fade']
  let display = 'none'
  const modalId = `InputLookupModal-${props.property.key}`

  if (displayValidations && !_.isEmpty(errors)) {
    groupClasses += ' has-error'
    error = errors.join(',')
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
        <span aria-hidden="true"><FontAwesomeIcon className="trash" icon={faTrashAlt} /></span>
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
              <AsyncTypeahead renderMenu={(results, menuProps) => renderMenuFunc(results, menuProps, Object.values(selectedAuthorities))}
                              renderToken={(option, props, idx) => renderTokenFunc(option, props, idx)}
                              disabled={isDisabled}
                              onChange={(newSelected) => selectionChanged(newSelected)}
                              options={props.getOptions(allResults.current)}
                              onSearch={setQuery}
                              selected={selected}
                              {...typeaheadProps}
                              filterBy={() => true}
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
        aria-label={'Lookups'}
        className="btn btn-sm btn-secondary btn-literal">
        +
      </button>
      { lookupSelection }
      <ModalWrapper modal={modal} />
    </React.Fragment>
  )
}

InputLookupModal.propTypes = {
  property: PropTypes.object.isRequired,
  getLookupResults: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired,
  show: PropTypes.bool,
  hideModal: PropTypes.func,
  textValue: PropTypes.string,
  lookupValues: PropTypes.array,
  removeValue: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const show = selectModalType(state) === `InputLookupModal-${ownProps.property.key}`
  return {
    lookupValues: ownProps.property.values,
    show,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ hideModal }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupModal)
