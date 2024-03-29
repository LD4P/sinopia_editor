// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import InputTemplate from "../InputTemplate"

// if you want to have have the input field pre-filled with a value (template id, label, author, etc.), put it here
export const defaultTemplateId = null

const TemplateFilter = ({ params, setParams }) => {
  const setTemplateId = (templateId) => {
    setParams({
      ...params,
      templateId,
    })
  }

  return (
    <React.Fragment>
      <div className="row">
        <label htmlFor="template-choice" className="col-sm-3 col-form-label">
          Search for template
        </label>
        <div className="col-sm-8">
          <InputTemplate
            id="template-choice"
            setTemplateId={setTemplateId}
            defaultTemplateId={defaultTemplateId}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

TemplateFilter.propTypes = {
  params: PropTypes.object.isRequired,
  setParams: PropTypes.func.isRequired,
}

export default TemplateFilter
