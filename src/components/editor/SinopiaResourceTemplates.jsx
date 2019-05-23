// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import Config from '../../../src/Config'
import { getEntityTagFromGroupContainer, listResourcesInGroupContainer, getResourceTemplate } from '../../sinopiaServer'
import { resourceToName } from '../../Utilities'

class SinopiaResourceTemplates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: [],
      resourceTemplates: [],
      resourceTemplatesEtag: ''
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.updateKey > prevProps.updateKey || await this.serverHasNewTemplates()) {
      // Reset errors when component updates, else errors from a prior update will prevent RTs from displaying
      this.setState({ errors: [] })
      await this.fetchResourceTemplatesFromGroups()
    }
  }

  serverHasNewTemplates = async () => {
    try {
      const currentEtag = await getEntityTagFromGroupContainer(Config.defaultSinopiaGroupId)
      if (this.state.resourceTemplatesEtag === currentEtag) {
        return false
      }
      this.setState({ resourceTemplatesEtag: currentEtag })
      return true
    } catch(error) {
      console.error(`error fetching RT group etag: ${error}`)
      return false
    }
  }

  fetchResourceTemplatesFromGroups = async () => {
    try {
      // TODO: once we begin storing RTs in different groups, in a future work cycle, do this:
      //
      // const getGroupsResponse = await getGroups()
      // const contains = [].concat(getGroupsResponse.response.body.contains).filter(Boolean)
      // contains.forEach(async group => {
      //   const groupName = resourceToName(group)
      //   const listResourcesInGroupResponse = await listResourcesInGroupContainer(groupName)
      //   // Short-circuit listing resources in a group if it contains nothing
      //   if (listResourcesInGroupResponse.response.body.contains)
      //     this.setStateFromServerResponse(groupName, listResourcesInGroupResponse.response.body.contains)
      // })
      const groupName = Config.defaultSinopiaGroupId
      const resourceTemplatesResponse = await listResourcesInGroupContainer(groupName)
      // Short-circuit listing resources in a group if it contains nothing
      if (resourceTemplatesResponse.response.body.contains)
        this.setStateFromServerResponse(groupName, resourceTemplatesResponse.response.body.contains)
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

      // Check if list of templates already in state contain a template w/ the same key as the retrieved one
      const templateIndex = templates.findIndex(template => template.key === retrievedTemplateObject.key)
      // When Array.prototype.findIndex() returns -1, that means the element was
      // not found in the array. The `if` condition here is true when an element
      // is found.
      if (templateIndex !== -1) {
        // Replace the current template with the retrieved one (in case it has been updated)
        templates.splice(templateIndex, 1, retrievedTemplateObject)
      } else {
        // Add missing/new template to list
        templates.push(retrievedTemplateObject)
      }

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

    const createResourceMessage =
          this.props.message.length === 0 ?
          ( <span /> ) :
          (
            <div className="alert alert-info">
              { this.props.message.join(', ') }
            </div>
          )

    const columns = [{
      dataField: 'name',
      text: 'Template name',
      sort: true,
      formatter: this.linkFormatter,
      headerStyle: { backgroundColor: '#F8F6EF', width: '25%' }
    },
    {
      dataField: 'id',
      text: 'ID',
      sort: true,
      headerStyle: { backgroundColor: '#F8F6EF', width: '50%' }
    },
    {
      dataField: 'group',
      text: 'Group',
      sort: true,
      headerStyle: { backgroundColor: '#F8F6EF', width: '25%' }
    }]

    return(
      <div>
        { createResourceMessage }
        <h4>Available Resource Templates in Sinopia</h4>
        <BootstrapTable keyField='key' data={ this.state.resourceTemplates } columns={ columns } />
      </div>
    )
  }
}

SinopiaResourceTemplates.propTypes = {
  message: PropTypes.array,
  updateKey: PropTypes.number
}

export default (SinopiaResourceTemplates)
