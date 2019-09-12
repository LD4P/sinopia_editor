// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getSearchResults } from 'actionCreators/qa'
import { changeSelections } from 'actions/index'
import shortid from 'shortid'
import {
  getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import InputURI from './InputURI'
import PropTypes from 'prop-types'
import _ from 'lodash'
import SinopiaPropTypes from 'SinopiaPropTypes'

export const DataListOption = (props) => {
  return (<option value={props.uri}
            id={props.id}
            key={shortid.generate()}>
      {props.label}
    </option>
  )
}

const search = (query, propertyTemplate) => (dispatch) => {
  console.log(`in search ${query}`)
  return getSearchResults(query, propertyTemplate).then((values) => {
    dispatch(qaResultsReceived(values))
  })
}

const InputLookupDataList = (props) => {
  const query = []
  const options = useState([])

  const handleKeypress = (event) => {
    query.push(event.key)
    if (query.length > 3) {
      const queryString = query.join('')
      console.log(`before search ${queryString}`)
      // search(queryString, props.propertyTemplate)
      // props.changeSelections(query)
      const resultPromise = getSearchResults(queryString, props.propertyTemplate)
      resultPromise.then((result) => {
        result.forEach((row) => {
          row.body.forEach((prop) => {
            console.log(prop)
            // const payload = {
            //   reduxPath: props.reduxPath,
            //   ...props
            // }
            // props.changeSelections(payload)
            options.push(<DataListOption {...prop} />)
            console.warn(options)
          })
        })
      })
      // result.forEach((prop) => {
      //   options.push(<DataListOption {...prop} />)
      // })

      //! Need to update options from result of QA Search
    }
  }

  let error
  let groupClasses = 'form-group'

  props.options?.forEach((row) => {
    options.push(<DataListOption {...row} />)
  })

  if (props.displayValidations && !_.isEmpty(props.errors)) {
    groupClasses += ' has-error'
    error = props.errors.join(',')
  }
  const dataListId = shortid.generate()
  return (
    <div className={groupClasses} query={query}>
      <InputURI list={dataListId}
                reduxPath={props.reduxPath}
                errors={props.errors}
                handleKeypress={handleKeypress}></InputURI>
      <datalist id={dataListId}>
        {options}
      </datalist>
      {error && <span className="help-block help-block-error">{error}</span>}
    </div>
  )
}

DataListOption.propTypes = {
  key: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  uri: PropTypes.string,
}

InputLookupDataList.propTypes = {
  displayValidations: PropTypes.func,
  errors: PropTypes.array,
  query: PropTypes.array,
  options: PropTypes.arrayOf(PropTypes.object),
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const errors = findErrors(state, reduxPath)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const options = state.selectorReducer.entities.qa.options
  return {
    errors,
    reduxPath,
    options,
    propertyTemplate,
  }
}


const mapDispatchToProps = dispatch => bindActionCreators({ changeSelections, search }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupDataList)
