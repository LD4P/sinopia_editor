// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import Alert from 'react-bootstrap/lib/Alert'
import DropZone from './DropZone'
import PropTypes from 'prop-types'
import Ajv from 'ajv' // JSON schema validation
import Config from 'Config'

const util = require('util')
// For JSON schema validation errors
const fileReader = new window.FileReader()

class ImportFileZone extends Component {
  constructor() {
    super()
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
    })
    this.state = {
      files: [],
      showDropZone: false,
      messages: [],
    }
  }

  handleClick = () => {
    const val = this.state.showDropZone

    this.setState({ showDropZone: !val })
  }

  addMessage(message) {
    const joined = this.state.messages.concat(message)
    this.setState({ messages: joined })
  }

  removeMessage(message) {
    const index = this.state.messages.indexOf(message)
    const joined = this.state.messages.splice(index, 1)
    this.setState({ messages: joined })
  }

  setGroup = (group) => {
    this.setState({ group })
  }

  onDropFile = (files) => {
    fileReader.onloadend = this.handleFileRead

    try {
      // Currently ResourceTemplate parses the profile and gets an array of objects; want just the objects
      fileReader.readAsText(files[0])
    } catch (err) {
      this.addMessage(`Error reading the loaded template: ${err}`)
    }

    this.setState({
      files,
    })
  }

  updateShowDropZone = (val) => {
    this.setState({ showDropZone: val })
  }

  handleFileRead = () => {
    let template

    try {
      template = JSON.parse(fileReader.result)

      this.promiseTemplateValidated(template, this.schemaUrl(template))
        .then(async () => {
          await this.props.setResourceTemplateCallback(template, this.state.group)
        })
        .catch((err) => {
          this.addMessage(`The profile you provided was not in an accepable format: ${err}`)
        })
    } catch (err) {
      this.addMessage(`The profile you provided was not valid JSON: ${err}`)
    }
  }

  schemaUrl = (template) => {
    let schemaUrl = template.schema || (template.Profile && template.Profile.schema)

    if (schemaUrl === undefined) {
      if (template.Profile) {
        schemaUrl = `https://ld4p.github.io/sinopia/schemas/${Config.defaultProfileSchemaVersion}/profile.json`
      } else {
        schemaUrl = `https://ld4p.github.io/sinopia/schemas/${Config.defaultProfileSchemaVersion}/resource-template.json`
      }
      this.addMessage(`No schema url found in template. Using ${schemaUrl}`)
    }

    return schemaUrl
  }

  promiseTemplateValidated = (template, schemaUrl) => new Promise((resolve, reject) => this.promiseSchemasLoaded(schemaUrl)
    .then(async () => {
      const isValid = this.ajv.validate(schemaUrl, template)

      if (!isValid) {
        return reject(new Error(`${util.inspect(this.ajv.errors)}`))
      }

      return resolve() // W00t!
    })
    .catch(err => reject(err)))

  promiseSchemasLoaded = schemaUrl => new Promise((resolve, reject) => {
    try {
      const schemaFunction = this.ajv.getSchema(schemaUrl)

      if (!schemaFunction) {
        this.fetchSchemaObjectsPromise(schemaUrl)
          .then((schemaObjs) => {
            schemaObjs.forEach((schemaObj) => {
              this.ajv.addSchema(schemaObj, schemaObj.id)
            })
          })
          .then(() => {
            resolve()
          })
          .catch((err) => {
            if (err.indexOf('already exists') > 0) resolve()
            else reject(new Error(`error getting json schemas ${err}`))
          })
      } else {
        resolve()
      }
    } catch (err) {
      reject(new Error(`error getting json schemas ${err}`))
    }
  })

  // TODO: cache the schemas in local storage (#292)
  fetchSchemaObjectsPromise = (schemaUrl) => {
    const schemaPrefixWithVersion = schemaUrl.match(/^(.*\d\.\d\.\d).*$/)[1]
    // TODO: recurse to fetch schemas from any $ref urls found in schema?
    const schemaSuffixes = [
      'profile.json',
      'resource-templates-array.json',
      'resource-template.json',
      'property-templates-array.json',
      'property-template.json',
    ]
    const schemaFetchPromises = []

    schemaSuffixes.forEach((schemaSuffix) => {
      const url = `${schemaPrefixWithVersion}/${schemaSuffix}`

      schemaFetchPromises.push(this.fetchJsonPromise(url))
    })

    return Promise.all(schemaFetchPromises)
  }

  fetchJsonPromise = uri => new Promise((resolve, reject) => {
    fetch(uri)
      .then((resp) => {
        if (resp.ok) {
          resp.json()
            .then((data) => {
              resolve(data)
            })
            .catch((err) => { reject(new Error(`Error parsing json ${uri} - ${err}`)) })
        } else {
          reject(new Error(`HTTP error fetching ${uri}: ${resp.status} - ${resp.statusText}`))
        }
      })
      .catch((err) => {
        reject(new Error(`Error fetching ${uri} - ${err}`))
      })
  })

  renderDropZone = () => (
    <DropZone showDropZoneCallback={this.updateShowDropZone}
              dropFileCallback={this.onDropFile}
              filesCallback={this.state.files}
              groupCallback={this.state.group}
              setGroupCallback={this.setGroup}
              defaultSinopiaGroupId={Config.defaultSinopiaGroupId} />
  )

  render() {
    const importFileZone = {
      display: 'flex',
      justifyContent: 'center',
      padding: '40px',
    }
    const dropzoneContainer = {
      display: 'flex',
      justifyContent: 'center',
    }

    const alerts = this.state.messages.map((message, idx) => (
      <Alert key={ idx } bsStyle="warning" onClose={() => this.removeMessage(message)} dismissible="true" >
        <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
        { message }
      </Alert>
    ))

    return (
      <section>
        <div className="ImportFileZone" style={importFileZone}>
          <button id="ImportProfile"
                  className="btn btn-primary btn-lg"
                  onClick={this.handleClick}>Import a Profile containing New or Revised Resource Templates</button>
        </div>
        <div className="dropzoneContainer" style={dropzoneContainer}>
          { this.state.showDropZone ? this.renderDropZone() : null }
        </div>
        { alerts }
      </section>
    )
  }
}

ImportFileZone.propTypes = {
  setResourceTemplateCallback: PropTypes.func,
  resourceTemplateId: PropTypes.string,
}
export default ImportFileZone
