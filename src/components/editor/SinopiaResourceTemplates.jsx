// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
const SinopiaServer = require('sinopia_server')
const instance = new SinopiaServer.LDPApi()
instance.apiClient.basePath = 'http://localhost:8080'

class SinopiaResourceTemplates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      groupData: [],
      templatesForGroup: []
    }
  }

  async componentDidMount() {
    const groupPromise = new Promise((resolve) => {
      resolve(instance.getBaseWithHttpInfo())
    }).then((data) => {
      return data
    }).catch(() => {})

    await this.fulfillGroupPromise(groupPromise).then(async () => {
      this.state.groupData.map((group) => {
        const name = this.resourceToName(group)
        new Promise((resolve) => {
          resolve(instance.getGroupWithHttpInfo(name))
        }).then((data) => {
          this.fulfillGroupData(data)
        }).catch(() => {})
      })
    })
  }


  fulfillGroupPromise = (promise) => {
    promise.then((data) => {
      const contains = [].concat(data.response.body.contains)
      this.setState({groupData: contains})
    }).catch((error) => {
      this.setState({message: error})
    })
    return promise
  }

  fulfillGroupData = (data) => {
    const groupName = this.resourceToName(data.response.body['@id'])

    data.response.body.contains.map((c) => {
      const name = this.resourceToName(c)

      const promise = new Promise(async (resolve) => {
        await resolve(instance.getResourceWithHttpInfo(groupName, name, { acceptEncoding: 'application/json' }))
      })

      promise.then((response_and_data) => {
        const data = response_and_data.response.body
        this.setState({tempState: {name: name, uri: c, id: `${groupName}:${data.id}`, group: groupName, data: data}})
        const joined = this.state.templatesForGroup.slice(0)
        joined.push(this.state.tempState)
        this.setState({templatesForGroup: joined})
      })

    })
  }

  resourceToName = (resource) => {
    const idx = resource.lastIndexOf('/')
    return resource.substring(idx+1)
  }

  linkFormatter = (cell, row) => {
    return(
      <Link to={{pathname: '/editor', state: { resourceTemplateData: row.data }}}>{cell}</Link>
    )
  }

  render(){
    if (this.state.message) {
      return (
        <div className="alert alert-warning alert-dismissible">
          <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
          No connection to the Sinopia Server is available, or there are no resources for any group
        </div>
      )
    }

    const thIDClass = { backgroundColor: '#F8F6EF', width: '50%' }
    const thNameClass = { backgroundColor: '#F8F6EF', width: '25%' }
    const thGroupClass = { backgroundColor: '#F8F6EF', width: '25%' }
    const tdIDClass = { width: '50%' }
    const tdNameClass = { width: '25%' }
    const tdGroupClass = { width: '25%' }

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
        <BootstrapTable keyField='id' data={ this.state.templatesForGroup } >
          <TableHeaderColumn thStyle={ thNameClass } tdStyle={ tdNameClass } dataFormat={ this.linkFormatter } dataField='name' dataSort={true} >Template name</TableHeaderColumn>
          <TableHeaderColumn thStyle={ thIDClass } tdStyle={ tdIDClass } dataField='id' dataSort={true} >ID</TableHeaderColumn>
          <TableHeaderColumn thStyle={ thGroupClass } tdStyle={ tdGroupClass } dataField='group' dataSort={true} >Group</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

export default (SinopiaResourceTemplates)