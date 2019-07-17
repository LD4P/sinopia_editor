import React from 'react'
import PropTypes from 'prop-types'
import { saveAs } from 'file-saver'
import { getResourceTemplate } from 'sinopiaServer'

const Download = (props) => {
  const handleFileDownload = () => {
    getResourceTemplate(props.resourceTemplateId, props.groupName).then((templateResponse) => {
      const template = templateResponse.response.body
      const filename = `${template.id}.json`
      const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
      saveAs(blob, filename)
    })
  }

  return (
    <button className="btn btn-link btn-linky" onClick={handleFileDownload}>Download</button>
  )
}

Download.propTypes = {
  resourceTemplateId: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
}

export default Download
