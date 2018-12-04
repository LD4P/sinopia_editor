// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component }  from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'

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

  handleClick() {
    let val = this.state.showDropZone
    this.setState({ showDropZone: !val })
  }

  onDropFile(files) {
    //supplies the json loaded from the profile file
    const handleFileRead = () => {
      const content = fileReader.result
      this.props.setResourceTemplateCallback(content)
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
    this.setState({ showDropZone: val })
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
          <button className="btn btn-primary btn-small" onClick={this.handleClick} >Import Profile</button>
          { this.state.showDropZone ? <DropZone showDropZoneCallback={this.updateShowDropZone} dropFileCallback={this.onDropFile} filesCallback={this.state.files}/> : null }
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
  setResourceTemplateCallback: PropTypes.func
}

export default StartingPoints;
