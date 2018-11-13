import React, { Component } from 'react'

class ValueConstraints extends Component {
  render() {
    let dashedBorder = {
      border: '1px dashed',
      padding: '10px',
    }

    const hasDefaults = this.props.defaults.length > 0
    const hasEditable = typeof(this.props.editable) !== 'undefined'
    const hasLanguageLabel = typeof(this.props.languageLabel) !== 'undefined'
    const hasLanguageURI = typeof(this.props.languageURI) !== 'undefined'
    const hasRemark = typeof(this.props.remark) !== 'undefined'
    const hasRepeatable = typeof(this.props.repeatable) !== 'undefined'
    const hasUseValuesFrom = this.props.useValuesFrom.length > 0
    const hasValidatePattern = typeof(this.props.validatePattern) !== 'undefined'
    const hasValueDataTypes = hasValues(this.props.valueDataType)
    const hasValueLanguage = typeof(this.props.valueLanguage) !== 'undefined'
    const hasValueTemplateRefs = this.props.valueTemplateRefs.length > 0

    return(
      <div className="ValueConstraints" style={dashedBorder}>
        <h6>VALUE CONSTRAINTS</h6>
        <ul>
          { hasDefaults? (<li>defaults: <Defaults defaults = {this.props.defaults} /></li>) : null }
          { hasEditable? (<li>editable: {this.props.editable}</li>) : null }
          { hasLanguageLabel? (<li>languageLabel: {this.props.languageLabel}</li>) : null }
          { hasLanguageURI? (<li>languageURI: {this.props.languageURI}</li>) : null }
          { hasRemark? (<li>remark: {this.props.remark}</li>) : null }
          { hasRepeatable? (<li>repeatable: {this.props.repeatable}</li>) : null }
          { hasUseValuesFrom? (<li>useValuesFrom: <UseValuesFrom useValuesFrom = {this.props.useValuesFrom} /></li>) : null }
          { hasValidatePattern? (<li>validatePattern: {this.props.validatePattern}</li>) : null }
          { hasValueDataTypes? ( <li>valueDataType: <ValueDataTypes valueDataTypes = {[this.props.valueDataType]} /></li>) : null }
          { hasValueLanguage? (<li>valueLanguage: {this.props.valueLanguage}</li>) : null }
          { hasValueTemplateRefs? (<li>valueTemplateRefs: <ValueTemplateRefs valueTemplateRefs = {this.props.valueTemplateRefs} /></li>) : null }
        </ul>
      </div>
    )
  }
}

class ValueDataTypes extends Component {
  render() {
    const obj = this.props.valueDataTypes
    if(hasValues(obj[0])){
      const hasRemark = obj[0].remark
      const hasDataTypeLabel = obj[0].dataTypeLabel
      const hasDataTypeLabelHint = obj[0].dataTypeLabelHint
      const hasDataTypeURI = obj[0].dataTypeURI
      return(
        <div>
          <ul>
            { hasRemark? (<li><em>remark: </em>{obj[0].remark}</li>) : null }
            { hasDataTypeLabel? (<li><em>data type label: </em>{obj[0].dataTypeLabel}</li>) : null }
            { hasDataTypeLabelHint? (<li><em>data type label hint: </em>{obj[0].dataTypeLabelHint}</li>) : null }
            { hasDataTypeURI? (<li><em>data type URI: </em>{obj[0].dataTypeURI}</li>) : null }
          </ul>
        </div>
      )
    } else {
     return(
       <span />
     )
    }
  }
}

class Defaults extends Component {
  render() {
    const obj = this.props.defaults[0]
    if (hasValues(obj)){
      return(
        <div>
          <ul>
            <li><em>defaultURI: </em>{obj.defaultURI}</li>
            <li><em>defaultLiteral: </em>{obj.defaultLiteral}</li>
          </ul>
        </div>
      )
    } else {
      return(
        <div />
      )
    }
  }
}

class UseValuesFrom extends Component {
  render() {
    const obj = this.props.useValuesFrom
    if(obj.length > 0) {
      return(
        <div>
          <ul>
            {obj.map(function(val, i){
              return(
                <li key={i}>{val}</li>
              )
            })}
          </ul>
        </div>
      )
    } else {
      return(
        <div />
      )
    }
  }
}

class ValueTemplateRefs extends Component {
  render() {
    const obj = this.props.valueTemplateRefs
    if(obj.length > 0) {
      return(
        <div>
          <ul>
            {obj.map(function(val, i){
              return(
                <li key={i}>{val}</li>
              )
            })}
          </ul>
        </div>
      )
    } else {
      return(
        <div />
      )
    }
  }
}

function hasValues(obj) {
  for(var key in obj) {
    if(obj.hasOwnProperty(key) && obj[key].length > 0)
      return true
  }
  return false
}

export default ValueConstraints