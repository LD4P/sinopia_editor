// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import Ajv from 'ajv' // JSON schema validation
import Config from '../../Config'

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
    }
  }


  handleClick = () => {
    const val = this.state.showDropZone

    this.setState({ showDropZone: !val })
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
      console.error(`error reading the loaded template as text: ${err}`)
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
          this.setState({ message: `ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem validating template: ${err}` })
        })
    } catch (err) {
      this.setState({ message: `ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem parsing JSON template: ${err}` })
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
      this.setState({ message: `No schema url found in template. Using ${schemaUrl}` })
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

    if (this.state.message) {
      return (
        <div className="alert alert-warning alert-dismissible">
          <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
          {this.state.message}
        </div>
      )
    }

    return (
      <section>
        <div className="ImportFileZone" style={importFileZone}>
          <button id="ImportProfile"
                  className="btn btn-primary btn-lg"
                  onClick={this.handleClick}>Import a Profile containing New or Revised Resource Templates</button>
        </div>
        <div className="dropzoneContainer" style={dropzoneContainer}>
          { this.state.showDropZone ? (<DropZone showDropZoneCallback={this.updateShowDropZone}
                                                 dropFileCallback={this.onDropFile}
                                                 filesCallback={this.state.files}
                                                 groupCallback={this.state.group}
                                                 setGroupCallback={this.setGroup} />) : null }
        </div>
      </section>
    )
  }
}

class DropZone extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  /*
   * TODO: When we need to let the user select a group:
   * handleChange = (event) => {
   *   this.props.setGroupCallback(event.target.value)
   *   this.setState({group: event.target.value})
   * }
   */
  handleOnDrop = (files) => {
    this.props.setGroupCallback(Config.defaultSinopiaGroupId)
    this.props.dropFileCallback(files)
  }

  render() {
    const fileName = {
      fontSize: '18px',
    }
    const listStyle = {
      listStyleType: 'none',
    }
    // TODO: fetch all the existing groups from trellis or a config source and render the select form:

    return (
      <section>
        {/* <strong> */}
        {/* 1.) Pick your Sinopia group: */}
        {/* </strong> */}
        {/* <form style={{paddingTop: '10px'}}> */}
        {/* <select value={this.state.group} onChange={this.handleChange}> */}
        {/*
          * If we need to have the user select a group, see e.g. select form in GroupChoiceModal
          * */}
        {/* </select> */}
        {/* </form> */}
        <strong>
          Drag and drop a resource template file in the box
          <div style={{ paddingLeft: '20px' }}>
            or click it to select a file to upload:
          </div>
        </strong>
        <div className="DropZone" style={{ paddingTop: '20px', paddingLeft: '20px' }}>
          <Dropzone
            onFileDialogCancel={() => this.props.showDropZoneCallback(false)}
            onDrop={this.handleOnDrop.bind(this)}
            multiple={false}
          />
          <aside>
            <h5>Loaded resource template file:</h5>
            <ul style={listStyle}>
              { this.props.filesCallback.map(f => <li style={fileName} key={f.name}>{f.name} - {f.size} bytes</li>) }
            </ul>
          </aside>
        </div>
      </section>
    )
  }
}

DropZone.propTypes = {
  dropFileCallback: PropTypes.func,
  showDropZoneCallback: PropTypes.func,
  filesCallback: PropTypes.array,
  setGroupCallback: PropTypes.func,
}
ImportFileZone.propTypes = {
  setResourceTemplateCallback: PropTypes.func,
  resourceTemplateId: PropTypes.string,
}
export default ImportFileZone
