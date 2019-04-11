// Copyright 2018 Stanford University see Apache2.txt for license

import Config from '../../Config'
import React, { Component }  from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import Ajv from 'ajv' // JSON schema validation
const util = require('util') // for JSON schema validation errors
import { Link } from 'react-router-dom'

class ImportFileZone extends Component {
  constructor() {
    super()
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true
    })
    this.state = {
      files: [],
      showDropZone: false
    }
  }

  handleClick = () => {
    let val = this.state.showDropZone
    this.setState({showDropZone: !val})
  }

  onDropFile = (files) => {
    // supplies the json loaded from the resource template
    const handleFileRead = () => {
      let template
      try {
        template = JSON.parse(fileReader.result)
        var schemaUrl = template.schema || (template.Profile && template.Profile.schema)
        if (schemaUrl == undefined) {
          if (template.Profile) {
            schemaUrl = `https://ld4p.github.io/sinopia/schemas/${Config.defaultProfileSchemaVersion}/profile.json`
          } else {
            schemaUrl = `https://ld4p.github.io/sinopia/schemas/${Config.defaultProfileSchemaVersion}/resource-template.json`
          }
          alert(`No schema url found in template. Using ${schemaUrl}`)
        }
        this.promiseTemplateValidated(template, schemaUrl)
        .then(() => {
          this.props.setResourceTemplateCallback(template)
        })
        .catch(err => {
          alert(`ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem validating template: ${err}`)
        })
      } catch (err) {
        alert(`ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem parsing JSON template: ${err}`)
      }
    }

    let fileReader = new window.FileReader()
    fileReader.onloadend = handleFileRead

    try {
      //currently ResourceTemplate parses the profile and gets an array of objects; want just the objects
      fileReader.readAsText(files[0])
    } catch(err) {
      console.error(`error reading the loaded template as text: ${err}`)
    }

    this.setState({
      files
    })
  }

  updateShowDropZone = (val) => {
    this.setState({showDropZone: val})
  }

  promiseTemplateValidated = (template, schemaUrl) => {
    return new Promise((resolve, reject) => {
      this.promiseSchemasLoaded(schemaUrl)
        .then(() => {
          const valid = this.ajv.validate(schemaUrl, template)
          if (!valid) {
            reject(new Error(`${util.inspect(this.ajv.errors)}`))
          }
          resolve() // w00t!
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  promiseSchemasLoaded = (schemaUrl) => {
    return new Promise((resolve, reject) => {
      try {
        var schemaFunction = this.ajv.getSchema(schemaUrl)
        if (!schemaFunction) {
          this.fetchSchemaObjectsPromise(schemaUrl)
            .then(schemaObjs => {
              schemaObjs.forEach( (schemaObj) => {
                this.ajv.addSchema(schemaObj, schemaObj.id)
              })
            })
            .then(() => {
              resolve()
            })
            .catch(err => {
              reject(new Error(`error getting json schemas ${err}`))
            })
        } else {
          resolve()
        }
      }
      catch(err) {
        reject(new Error(`error getting json schemas ${err}`))
      }
    })
  }

  // TODO: cache the schemas in local storage (#292)
  fetchSchemaObjectsPromise = (schemaUrl) => {
    const schemaPrefixWithVersion = schemaUrl.match(/^(.*\d\.\d\.\d).*$/)[1]
    // TODO: recurse to fetch schemas from any $ref urls found in schema?
    const schemaSuffixes = [
      "profile.json",
      "resource-templates-array.json",
      "resource-template.json",
      "property-templates-array.json",
      "property-template.json"
    ]
    const schemaFetchPromises = []
    schemaSuffixes.forEach( (schemaSuffix) => {
      var url = `${schemaPrefixWithVersion}/${schemaSuffix}`
      schemaFetchPromises.push(this.fetchJsonPromise(url))
    })

    return Promise.all(schemaFetchPromises)
  }

  fetchJsonPromise = (uri) => {
    return new Promise((resolve, reject) => {
      fetch(uri)
      .then(resp => {
        if (resp.ok) {
          resp.json()
            .then(data => {
              resolve(data)
            })
            .catch(err => { reject(new Error(`Error parsing json ${uri} - ${err}`))})
        }
        else {
          reject(new Error(`HTTP error fetching ${uri}: ${resp.status} - ${resp.statusText}`))
        }
      })
      .catch((err) => {
        reject(new Error(`Error fetching ${uri} - ${err}`))
      })
    })
  }

  reloadEditor = () => {
    window.location.reload()
  }

  render() {
    let importFileZone = {
      display: 'flex',
      justifyContent: 'center',
      padding: '40px'
    }
    let dropzoneContainer = {
      display: 'flex',
      justifyContent: 'center'
    }
    return (
      <section>
        <div className="ImportFileZone" style={importFileZone}>
          <div><Link to="/editor" onClick={() => {this.reloadEditor()}}>{this.props.defaultRtId}</Link></div>
          <button id="ImportProfile" className="btn btn-primary btn-lg" onClick={this.handleClick}>Import New or Revised Resource Template</button>
        </div>
        <div className="dropzoneContainer" style={dropzoneContainer}>
          { this.state.showDropZone ? <DropZone showDropZoneCallback={this.updateShowDropZone} dropFileCallback={this.onDropFile} filesCallback={this.state.files}/> : null }
        </div>
      </section>
    )
  }
}

class DropZone extends Component {
  render() {
    let fileName = {
      fontSize: '18px'
    }
    let listStyle = {
      listStyleType: 'none'
    }
    return (
      <section>
        <br /><p>Drop resource template file <br />
        or click to select a file to upload:</p>
        <div className="DropZone">
          <Dropzone
            onFileDialogCancel={() => this.props.showDropZoneCallback(false)}
            onDrop={this.props.dropFileCallback.bind(this)}
          >
          </Dropzone>
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
  filesCallback: PropTypes.array
}
ImportFileZone.propTypes = {
  tempStateCallback: PropTypes.func,
  setResourceTemplateCallback: PropTypes.func,
  resourceTemplateId: PropTypes.string,
  defaultRtId: PropTypes.string
}

export default ImportFileZone
