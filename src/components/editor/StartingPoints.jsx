// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component }  from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
const Ajv = require('ajv') // JSON schema validation
const util = require('util') // for JSON schema validation errors
import { Link } from 'react-router-dom'

class StartingPoints extends Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.onDropFile = this.onDropFile.bind(this)
    this.state = {
      files: [],
      showDropZone: false
    }
  }

  componentDidMount() {
    this.fetchSchemaObjectsPromise()
      .then(schemaObjs => {
        this.ajv = new Ajv({
          schemas: schemaObjs,
          allErrors: true,
          verbose: true
        })
      })
      .catch(err => {
        console.error(`componentDidMount: error getting json schemas ${err}`)
      })
  }

  handleClick() {
    let val = this.state.showDropZone
    this.setState({showDropZone: !val})
  }

  onDropFile(files) {
    // supplies the json loaded from the resource template
    const handleFileRead = () => {
      const content = fileReader.result
      const valid = this.validateTemplate(JSON.parse(content))
      if (valid) {
        this.props.setResourceTemplateCallback(content)
      }
      else {
        // TODO: don't continue on with display of ResourceTemplate component (#295)
        console.error("ERROR: unable to use template as it isn't valid - we shouldn't display form")
      }
    }

    let fileReader = new window.FileReader()
    fileReader.onloadend = handleFileRead
    //currently ResourceTemplate parses the profile and gets an array of objects; want just the objects
    fileReader.readAsText(files[0])

    this.setState({
      files
    })
  }

  updateShowDropZone = (val) => {
    this.setState({showDropZone: val})
  }

  validateTemplate = (template) => {
    // TODO: get schema $id from template being validated (#294)
    const valid = this.ajv.validate('https://ld4p.github.io/sinopia/schemas/0.0.1/profile.json', template)
    // TODO:  indicate template validity to user (#295)
    console.debug(`resource template is valid? ${valid}`)
    if (!valid) {
      // TODO:  indicate template errors to user (#295)
      console.error(`template isn't valid: ${util.inspect(this.ajv.errors)}`)
    }
    return valid
  }

  // return array of objects - one for each fetched json schema file
  // TODO: cache the schemas in local storage (#292)
  fetchSchemaObjectsPromise = () => {
    // TODO: get schema url from template json ... once it is in the template json (#294)
    // TODO: recurse to fetch schemas from any $ref urls found in schema?
    const schemaUrls = [
      'https://ld4p.github.io/sinopia/schemas/0.0.1/profile.json',
      'https://ld4p.github.io/sinopia/schemas/0.0.1/resource-templates-array.json',
      'https://ld4p.github.io/sinopia/schemas/0.0.1/resource-template.json',
      'https://ld4p.github.io/sinopia/schemas/0.0.1/property-templates-array.json',
      'https://ld4p.github.io/sinopia/schemas/0.0.1/property-template.json'
    ]
    const schemaFetchPromises = []
    schemaUrls.forEach((url) => {
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
              .catch(err => {
                reject(new Error(`Error parsing json schema ${uri} - ${err}`))
              })
          }
          else {
            reject(new Error(`HTTP error fetching schema: ${resp.status} - ${resp.statusText}`))
          }
        })
        .catch((err) => {
          reject(new Error(`Error fetching schema ${uri} - ${err}`))
        })
    })
  }

  resetShowDropZone() {
    this.updateShowDropZone(false)
    this.setState({files: []})
    this.props.tempStateCallback()

  }

  render() {
    let startingPoints = {
      border: '1px dotted',
      float: 'left',
      padding: '20px',
    }
    return (
      <section>
              <div className="StartingPoints" style={startingPoints}>
                      <h3>Create Resource</h3>
                      <div><Link to={{pathname: "/editor", state: {rtId: this.props.resourceTemplateId}}} onClick={() => {this.resetShowDropZone()}}>{this.props.resourceTemplateId}</Link></div>
                      <button className="btn btn-primary btn-small" onClick={this.handleClick}>Import Profile</button>
                {this.state.showDropZone ? <DropZone showDropZoneCallback={this.updateShowDropZone} dropFileCallback={this.onDropFile} filesCallback={this.state.files}/> : null}
              </div>
      </section>
    )
  }
}

class DropZone extends Component {
  render() {
    return (
      <section>
        <br /><p>Drop resource template file <br />
        or click to select a file to upload:</p>
        <div>
          <Dropzone
            onFileDialogCancel={() => this.props.showDropZoneCallback(false)}
            onDrop={this.props.dropFileCallback.bind(this)}
          >
          </Dropzone>
          <aside>
            <h4>Loaded resource template file:</h4>
            <ul>
              { this.props.filesCallback.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>) }
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
StartingPoints.propTypes = {
  tempStateCallback: PropTypes.func,
  resourceTemplatesCallback: PropTypes.func,
  setResourceTemplateCallback: PropTypes.func,
  resourceTemplateId: PropTypes.string
}

export default StartingPoints;
