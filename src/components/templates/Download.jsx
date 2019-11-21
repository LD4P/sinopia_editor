import React from 'react'
import PropTypes from 'prop-types'
import { saveAs } from 'file-saver'
import { getResourceTemplate } from 'sinopiaServer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

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
    <button type="button"
            data-testid="download-link"
            className="btn btn-link"
            onClick={handleFileDownload}
            title="Download"
            aria-label="Download this resource template">
      <FontAwesomeIcon icon={faDownload} className="icon-lg" />
    </button>
  )
}

Download.propTypes = {
  resourceTemplateId: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
}

export default Download
