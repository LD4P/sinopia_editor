// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getSearchResults, search } from 'actionCreators/qa'
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

const InputLookupDataList = (props) => {
  const query = []
  const options = []

  const handleKeypress = (event) => {
    query.push(event.key)
    if (query.length > 3) {
      const queryString = query.join('')
      const result = getSearchResults(queryString, props.propertyTemplate)
      console.log(`This is the query search`)
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
  const options = ownProps.options || []
  return {
    errors,
    reduxPath,
    options,
    propertyTemplate,
  }
}


const mapDispatchToProps = dispatch => bindActionCreators({ search }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupDataList)
