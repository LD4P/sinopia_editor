// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
const SinopiaServer = require('sinopia_server')
const instance = new SinopiaServer.LDPApi()
instance.apiClient.basePath = 'http://localhost:8080'

const groupPromise = new Promise((resolve) => {
  resolve(instance.getBaseWithHttpInfo())
})
const ld4pGroupDataPromise = new Promise((resolve) => {
  resolve(instance.getGroupWithHttpInfo('ld4p'))
})

class SinopiaResourceTemplates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      groupData: [],
      ld4pGroupData: []
    }
  }

  componentDidMount() {
    groupPromise.then((data) => {
      if(typeof data.response.body.contains === 'Array') {
        this.setState({groupData: data.response.body.contains})
      } else {
        this.setState({groupData: [data.response.body.contains]})
      }
    }, function(error) {
      console.error(error)
    })

    ld4pGroupDataPromise.then((data) => {
      this.setState({ld4pGroupData: data.response.body.contains})
    }, function(error) {
      console.error(error)
    })

    // this.state.ld4pGroupData.map((resource, index) => {
    //   const name = this.resourceToName(resource)
    //
    //   const promise = new Promise((resolve) => {
    //     resolve(instance.getResourceWithHttpInfo('ld4p', name))
    //   })
    //
    //   promise.then((data) => {
    //     console.log(data)
    //   })
    // })
  }

  resourceToName = (resource) => {
    const idx = resource.lastIndexOf('/')
    return resource.substring(idx+1)
  }

  render(){
    return(
      <div>
        <h4>Groups in Sinopia</h4>
        <ul>
          { this.state.groupData.map((container, index) => {
            return(
              <li key={index}>{container}</li>
            )
          })}
        </ul>
        <h4>Available Resource Templates in Sinopia</h4>
        <ul>
          { this.state.ld4pGroupData.map((resource, index) => {
            const name = this.resourceToName(resource)

            const promise = new Promise((resolve) => {
              resolve(instance.getResourceWithHttpInfo('ld4p', name))
            })

            promise.then((response_and_data) => {
              console.log(response_and_data.response)
            })

            return(
              <li key={index}>{resource}</li>
            )
          })}
        </ul>
      </div>
    )
  }
}

SinopiaResourceTemplates.propTypes = {

}

export default (SinopiaResourceTemplates)