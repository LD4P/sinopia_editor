// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Config from '../../../src/Config'
const _ = require('lodash')
const SinopiaServer = require('sinopia_server')
const instance = new SinopiaServer.LDPApi()
instance.apiClient.basePath = Config.sinopiaServerBase

class SinopiaResourceTemplates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
      groupData: [],
      templatesForGroup: [],
      contains: []
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.updateKey > prevProps.updateKey) {
      const groupPromise = new Promise((resolve) => {
        resolve(instance.getBaseWithHttpInfo())
      }).then((data) => {
        return data
      }).catch(() => {})

      await this.fulfillGroupPromise(groupPromise).then(async () => {
        this.state.groupData.map((group) => {
          const groupName = this.resourceToName(group)
          new Promise((resolve) => {
            resolve(instance.getGroupWithHttpInfo(groupName))
          }).then((data) => {
            this.fulfillGroupData(data)
          }).catch(() => {})
        })
      })
    }
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

    if (data.response.body.contains !== undefined) {
      const contains = [].concat(data.response.body.contains)

      contains.map((c) => {
        const name = this.resourceToName(c)

        this.groupDataPromise(groupName, name).then((data) => {
          const rt = data.response.body
          this.setState({tempState: {key: rt.id, name: rt.resourceLabel, uri: c, id: rt.id, group: groupName}})
          const joined = this.state.templatesForGroup.slice(0)
          if (!_.find(joined, ['key', this.state.tempState.key])) {
            joined.push(this.state.tempState)
          }
          this.setState({templatesForGroup: joined})
        }).catch(() => {})
      })
    }

  }

  groupDataPromise = (groupName, name) => new Promise(async (resolve) => {
    await resolve(instance.getResourceWithHttpInfo(groupName, name, { acceptEncoding: 'application/json' }))
  })

  resourceToName = (resource) => {
    const idx = resource.lastIndexOf('/')
    return resource.substring(idx+1)
  }

  linkFormatter = (cell, row) => {
    return(
      <Link to={{pathname: '/editor', state: { resourceTemplateId: row.id }}}>{cell}</Link>
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

    let createResourceMessage = <div className="alert alert-info alert-dismissible">
      <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
      { this.props.message.join(', ') }
    </div>;

    if(this.props.message.length === 0) {
      createResourceMessage = <span />
    }

    const thIDClass = { backgroundColor: '#F8F6EF', width: '50%' }
    const thNameClass = { backgroundColor: '#F8F6EF', width: '25%' }
    const thGroupClass = { backgroundColor: '#F8F6EF', width: '25%' }
    const tdIDClass = { width: '50%' }
    const tdNameClass = { width: '25%' }
    const tdGroupClass = { width: '25%' }

    return(
      <div>
        { createResourceMessage }
        <h4>Groups in Sinopia</h4>
        <ul>
          { this.state.groupData.map((container, index) => {
            return(
              <li key={index}>{this.resourceToName(container)}</li>
            )
          })}
        </ul>
        <h4>Available Resource Templates in Sinopia</h4>
        <BootstrapTable keyField='key' data={ this.state.templatesForGroup } >
          <TableHeaderColumn thStyle={ thNameClass } tdStyle={ tdNameClass } dataFormat={ this.linkFormatter } dataField='name' dataSort={true} >Template name</TableHeaderColumn>
          <TableHeaderColumn thStyle={ thIDClass } tdStyle={ tdIDClass } dataField='id' dataSort={true} >ID</TableHeaderColumn>
          <TableHeaderColumn thStyle={ thGroupClass } tdStyle={ tdGroupClass } dataField='group' dataSort={true} >Group</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

SinopiaResourceTemplates.propTypes = {
  message: PropTypes.array,
  updateKey: PropTypes.number
}

export default (SinopiaResourceTemplates)