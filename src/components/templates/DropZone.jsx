// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'

const DropZone = (props) => {
  const handleOnDrop = (files) => {
    props.setGroupCallback(props.defaultSinopiaGroupId)
    props.dropFileCallback(files)
  }

  const fileName = {
    fontSize: '18px',
  }
  const listStyle = {
    listStyleType: 'none',
  }

  return (
    <section>
      <strong>
        Drag and drop a resource template file in the box
        <div style={{ paddingLeft: '20px' }}>
          or click it to select a file to upload:
        </div>
      </strong>
      <div className="DropZone" style={{ paddingTop: '20px', paddingLeft: '20px' }}>
        <Dropzone
          onFileDialogCancel={() => props.showDropZoneCallback(false)}
          onDrop={handleOnDrop.bind(this)}
          multiple={false}
        />
        <aside>
          <h5>Loaded resource template file:</h5>
          <ul style={listStyle}>
            { props.filesCallback.map(f => <li style={fileName} key={f.name}>{f.name} - {f.size} bytes</li>) }
          </ul>
        </aside>
      </div>
    </section>
  )
}


DropZone.propTypes = {
  dropFileCallback: PropTypes.func,
  showDropZoneCallback: PropTypes.func,
  filesCallback: PropTypes.array,
  setGroupCallback: PropTypes.func,
  defaultSinopiaGroupId: PropTypes.string,
}

export default DropZone
