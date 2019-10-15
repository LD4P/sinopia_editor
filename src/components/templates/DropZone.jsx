// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import Config from 'Config'

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

export default DropZone
