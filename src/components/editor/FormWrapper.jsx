// Copyright 2018 Stanford University see Apache2.txt for license
import React, { Component }  from 'react'
import PropertyTemplate from './PropertyTemplate'

class FormWrapper extends Component{
  render () {
    console.log(this.props.propertyTemplates[0])
    let dashedBorder = {
      border: '1px dashed',
      padding: '10px',
    }
    if (this.props.propertyTemplates.length == 0 || this.props.propertyTemplates[0] == {}) {
      return <h1>We should have propertyTemplates but we don't.</h1>
    } else {
      return (
        <form className="form-horizontal" style={dashedBorder}>
          <div className='FormWrapper'>
            <p>BEGIN FormWrapper</p>
              <div>
                {this.props.propertyTemplates[0].map(function(pt, index){
                  return <PropertyTemplate key={index} propertyTemplates={[pt]}/>
                })}
              </div>
            <p>END FormWrapper</p>
          </div>
        </form>
      )
    }
  }
}

export default FormWrapper;
