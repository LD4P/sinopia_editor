// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component }  from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'

class StartingPoints extends Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.state = {
      files: [],
      showDropZone: false
    }
  }

  handleClick() {
    let val = this.state.showDropZone
    this.setState({ showDropZone: !val })
  }

  onDrop(files) {
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
      padding: '20px'
    }
    return (
      <section>
        <div className="StartingPoints" style={startingPoints}>
          <h3>Create Resource</h3>
          <button className="btn btn-primary btn-small" onClick={this.handleClick} >Import Profile</button>
          { this.state.showDropZone ? <DropZone showDropZoneCB={this.updateShowDropZone} onDropCB={this.onDrop} filesCB={this.state.files}/> : null }
        </div>
      </section>
    )
  }
}

class DropZone extends Component {
  render() {
    return (
      <section>
        <p>Drop profile files here or click to select a file:</p>
        <div>
          <Dropzone
            onFileDialogCancel={() => this.props.showDropZoneCB(false)}
            onDrop={this.props.onDropCB.bind(this)}
          >
          </Dropzone>
          <aside>
            <h4>Dropped files:</h4>
            <ul>
              { this.props.filesCB.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>) }
            </ul>
          </aside>
        </div>
      </section>
    )
  }
}

DropZone.propTypes = {
  onDropCB: PropTypes.func,
  showDropZoneCB: PropTypes.func,
  filesCB: PropTypes.array
}

export default StartingPoints;
