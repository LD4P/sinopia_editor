// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
const SinopiaServer = require('sinopia_server')
const instance = new SinopiaServer.LDPApi()
instance.apiClient.basePath = 'http://localhost:8080'

const groupPromise = new Promise((resolve, reject) => {
  resolve(instance.getBaseWithHttpInfo())
})

const ld4pGroupDataPromise = new Promise((resolve, reject) => {
  resolve(instance.getGroupWithHttpInfo('ld4p'))
})

class SinopiaResourceTemplates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      groupData: [],
      templatesForGroup: []
    }
  }

  componentDidMount() {
    groupPromise.then((data) => {
      const contains = data.response.body.contains
      if(typeof contains.constructor === Array) {
        this.setState({groupData: data.response.body.contains})
      } else {
        this.setState({groupData: [data.response.body.contains]})
      }
    }).catch((error) => {
      this.setState({message: error})
    })

    //TODO: get resource templates for other groups
    ld4pGroupDataPromise.then((data) => {
      let joined = []
      data.response.body.contains.map((c) => {
        const name = this.resourceToName(c)

        const promise = new Promise((resolve) => {
          resolve(instance.getResourceWithHttpInfo('ld4p', name, { acceptEncoding: 'application/json' }))
        })

        promise.then((response_and_data) => {
          joined.push({name: name, uri: c, id: response_and_data.response.body.id, group: 'ld4p'})
          this.setState({templatesForGroup: joined})
        })

      })
    }).catch((error) => {
      this.setState({message: error})
    })
  }

  resourceToName = (resource) => {
    const idx = resource.lastIndexOf('/')
    return resource.substring(idx+1)
  }

  render(){
    const columns = [{
      dataField: 'id',
      text: 'Template name',
      sort: true
    }, {
      dataField: 'name',
      text: 'ID',
      sort: true
    }, {
      dataField: 'group',
      text: 'Group'
    }];

    if (this.state.message) {
      return (
        <div className="alert alert-warning alert-dismissible">
          <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
          No connection to the Sinopia Server is available, or there are no resources for any group
        </div>
      )
    }

    return(
      <div>
        <h4>Groups in Sinopia</h4>
        <ul>
          { this.state.groupData.map((container, index) => {
            return(
              <li key={index}>{this.resourceToName(container)}</li>
            )
          })}
        </ul>
        <h4>Available Resource Templates in Sinopia</h4>
        <BootstrapTable keyField='id' data={ this.state.templatesForGroup } columns={ columns } />
      </div>
    )
  }
}

export default (SinopiaResourceTemplates)