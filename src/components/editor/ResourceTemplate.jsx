// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component }  from 'react'
import { connect } from 'react-redux'
import ResourceTemplateForm from './ResourceTemplateForm'
import { setResourceTemplate } from '../../actions/index'
import { getResourceTemplate } from '../../sinopiaServer'
import PropTypes from 'prop-types'

class ResourceTemplate extends Component {

  render () {

    const resourceTemplateData = (rtd) => {
      let result
      // if there is no data, lookup the data with the resource template id
      // e.g. at startup
      if (rtd === undefined) {
        result = [getResourceTemplate(this.props.resourceTemplateId)]
      }
      else {
        if (typeof rtd === 'object') {
          // Enable us to  use profiles or resourceTemplate
          if (rtd.propertyTemplates){
            result = [rtd]
          }
          else if (rtd.Profile) {
            // TODO:  if we allow profiles to be "imported" into BFF,
            //  ask user which resourceTemplate they want?
            result = rtd.Profile.resourceTemplates
          }
        }
      }
      return result
    }

    const rtData = resourceTemplateData(this.props.resourceTemplateData)

    //TODO: Make rt not an array and just a single element.  You. Shall. Not. Pass.
    return (
      <div>
        {rtData.map((rt, index) => {
          this.props.handleResourceTemplate(rt)
          return(    
            <div>
              <div className='row'> 
                  <section className='col-md-9'>
                      <h3>{rt.resourceURI}</h3>
                      <h1>[Clone|Edit] <em>{rt.resourceLabel}</em></h1>
                  </section>
            </div>   
            <div className='ResourceTemplate' key={index}>
              <div id="resourceTemplate">
                  <ResourceTemplateForm
                    propertyTemplates = {rt.propertyTemplates}
                    resourceTemplate = {rt}
                    parentResourceTemplate = {this.props.resourceTemplateId}
                    rtId = {rt.id}
                  />
              </div>
            </div>
            </div>
          )
        })}
      </div>
    )
  }
}

ResourceTemplate.propTypes = {
  handleResourceTemplate: PropTypes.func,
  resourceTemplateId: PropTypes.string,
  resourceTemplateData: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}

const mapDispatchToProps = dispatch => ({
  handleResourceTemplate(resource_template) {
    dispatch(setResourceTemplate(resource_template))
  }
})

export default connect(null, mapDispatchToProps)(ResourceTemplate);
