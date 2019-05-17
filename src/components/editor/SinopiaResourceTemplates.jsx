// Copyright 2019 Stanford University see Apache2.txt for license

import SinopiaServer from 'sinopia_server'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Config from '../../../src/Config'
import { getGroups, listResourcesInGroupContainer, getResourceTemplate } from '../../sinopiaServer'
import { resourceToName } from '../../Utilities'

const instance = new SinopiaServer.LDPApi()
instance.apiClient.basePath = Config.sinopiaServerBase

class SinopiaResourceTemplates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: [],
      resourceTemplates: [],
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.updateKey <= prevProps.updateKey) {
      return
    }

    await this.fetchResourceTemplatesFromGroups()
  }

  fetchResourceTemplatesFromGroups = async () => {
    try {
      const getGroupsResponse = await getGroups()
      const contains = [].concat(getGroupsResponse.response.body.contains).filter(Boolean)
      contains.forEach(async group => {
        const groupName = resourceToName(group)
        const listResourcesInGroupResponse = await listResourcesInGroupContainer(groupName)
        // Short-circuit listing resources in a group if it contains nothing
        if (listResourcesInGroupResponse.response.body.contains)
          this.setStateFromServerResponse(groupName, listResourcesInGroupResponse.response.body.contains)
      })
    } catch(error) {
      const errors = [...this.state.errors, error]
      this.setState({ errors: errors })
    }
  }

  setStateFromServerResponse = (groupName, groupContains) => {
    // Array-ify the value of `groupContains` as it can be either a string or an array
    const templateIds = [].concat(groupContains)

    templateIds.forEach(async templateId => {
      const templateName = resourceToName(templateId)
      const templateResponse = await getResourceTemplate(templateName, groupName)
      const resourceTemplateBody = templateResponse.response.body

      const retrievedTemplateObject = {
        key: resourceTemplateBody.id,
        name: resourceTemplateBody.resourceLabel,
        uri: templateId,
        id: resourceTemplateBody.id,
        group: groupName
      }

      const templates = [...this.state.resourceTemplates]

      // Check if newly retrieved template is already stored in component state. If not, add it.
      if (!templates.some(template => template.key === retrievedTemplateObject.key))
        templates.push(retrievedTemplateObject)

      this.setState({
        resourceTemplates: templates
      })
    })
  }

  linkFormatter = (cell, row) => {
    return(
      <Link to={{pathname: '/editor', state: { resourceTemplateId: row.id }}}>{cell}</Link>
    )
  }

  render() {
    if (this.state.errors.length > 0) {
      return (
        <div className="alert alert-warning alert-dismissible">
          <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
          No connection to the Sinopia Server is available, or there are no resources for any group.
        </div>
      )
    }

    let createResourceMessage = <div className="alert alert-info alert-dismissible">
      <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
      { this.props.message.join(', ') }
    </div>;

    if (this.props.message.length === 0) {
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
        <h4>Available Resource Templates in Sinopia</h4>
        <BootstrapTable keyField='key' data={ this.state.resourceTemplates } >
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
