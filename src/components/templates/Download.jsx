import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { saveAs } from 'file-saver'

class Download extends Component {
  handleFileDownload = (blob, filename) => {
    saveAs(blob, filename)
  }

  render() {
    return (
      <button className="btn btn-link btn-linky" onClick={() => this.handleFileDownload(this.props.blob, this.props.filename)}>Download</button>
    )
  }
}

Download.propTypes = {
  filename: PropTypes.string.isRequired,
  blob: PropTypes.object.isRequired,
}

export default Download
