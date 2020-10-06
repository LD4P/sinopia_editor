// Copyright 2020 Stanford University see LICENSE for license

import React, {
  useState, useRef, useMemo, useEffect, useCallback,
} from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import shortid from 'shortid'
import { newUriValue, newLiteralValue } from 'utilities/valueFactory'
import { addProperty } from 'actions/resources'
import { hideModal } from 'actions/modals'
import { selectNormValues } from 'selectors/resources'
import { isValidURI } from 'utilities/Utilities'
import { clearSearchResults as clearSearchResultsAction } from 'actions/search'
import RenderLookupContext from './RenderLookupContext'
import Tab from '../Tab'
import Tabs from '../Tabs'


// This does a lookup, and puts the results from the various authorities into
// individual tab panels.
const LookupWithMultipleAuthorities = (props) => {
  const dispatch = useDispatch()
  const values = useSelector((state) => selectNormValues(state, props.property.valueKeys))

  const [, setTriggerRender] = useState('')
  const [tabKey, setTabKey] = useState()
  const [query, setQuery] = useState(false)

  // Using a ref so that can append to current list of results.
  const allResults = useRef([])

  // Tokens allow us to cancel an existing search. Does not actually stop the
  // search, but causes result to be ignored.
  const tokens = useRef([])

  const allAuthorities = useMemo(() => {
    const authorities = {}
    props.propertyTemplate.authorities.forEach((authority) => authorities[authority.uri] = authority)
    return Object.values(authorities)
  }, [props.propertyTemplate.authorities])

  const clearSearchResults = useCallback(() => dispatch(clearSearchResultsAction('resource')), [dispatch])
  const loadingSearchRef = useRef(null)

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
    const resultPromises = getLookupResults(query, allAuthorities)
    // show the search spinner pending the results
    clearSearchResults()
    if (loadingSearchRef.current) loadingSearchRef.current.classList.remove('hidden')

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
  }, [query, allAuthorities, getLookupResults])

  // hide the spinner after the results are fetched
  if (allResults.current.length > 0) loadingSearchRef.current.classList.add('hidden')

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

  const renderMenuFunc = (results, lookupConfigs) => {
    const resultsFor = {}
    // First split the results out by authority id.
    lookupConfigs.forEach((authority) => {
      resultsFor[authority.uri] = []
      let inAuthority = false
      results.forEach((row) => {
        if ('authURI' in row) {
          if (row.authURI === authority.uri) {
            inAuthority = true
            return
          }
          inAuthority = false
        }
        if (inAuthority) {
          resultsFor[authority.uri].push(row)
        }
      })
    })

    const tabs = lookupConfigs.map((authority) => {
      const items = resultsFor[authority.uri].map((result, i) => {
        if (result.authURI) return
        if (result.customOption) return
        if (result.isError) {
          const errorMessage = result.label || 'An error occurred in retrieving results'
          return (<h2 key={shortid.generate()}>
            <span className="dropdown-error">{errorMessage}</span>
          </h2>)
        }
        const key = `${authority.uri}-${i}`
        return (<div key={key}>
          <button onClick={() => selectionChanged(result)} className="btn search-result">
            { result.context ? (
              <RenderLookupContext innerResult={result}
                                   authLabel={authority.label}
                                   authURI={authority.uri}></RenderLookupContext>
            ) : result.label
            }
          </button>
        </div>)
      })

      return (<Tab key={authority.uri} eventKey={authority.uri} title={authority.label}>
        {items}
      </Tab>)
    })

    return (
      <Tabs
        id="controlled-tab-example"
        activeKey={tabKey}
        onSelect={(k) => setTabKey(k)}
      >
        {tabs}
      </Tabs>
    )
  }

  const options = renderMenuFunc(props.getOptions(allResults.current), allAuthorities)

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
            {options}
            <div ref={loadingSearchRef} id="search-results-loading" className="hidden text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Results Loading...</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-link" onClick={ close }>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

LookupWithMultipleAuthorities.propTypes = {
  modalId: PropTypes.string,
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  getLookupResults: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired,
  show: PropTypes.bool,
}


export default LookupWithMultipleAuthorities
