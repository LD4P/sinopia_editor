// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'
import PropTypes from 'prop-types'
import { closeResourceTemplateChooser as closeResourceTemplateChooserAction } from 'actions/index'

const ResourceTemplateChoiceModal = (props) => {
  const dispatch = useDispatch()
  const closeResourceTemplateChooser = () => dispatch(closeResourceTemplateChooserAction())

  const show = useSelector(state => state.selectorReducer.editor.resourceTemplateChoice.show)

  const resourceTemplateSummaries = useSelector(state => Object.values(state.selectorReducer.entities.resourceTemplateSummaries))
  const sortedResourceTemplateSummaries = useMemo(() => resourceTemplateSummaries.sort(
    (a, b) => a.name.localeCompare(b.name),
  ), [resourceTemplateSummaries])

  const defaultSelectedValue = sortedResourceTemplateSummaries.length > 0 ? sortedResourceTemplateSummaries[0].id : ''
  const [selectedValue, setSelectedValue] = useState(defaultSelectedValue)

  const updateSelectedValue = (event) => {
    setSelectedValue(event.target.value)
  }

  const saveAndClose = () => {
    props.choose(selectedValue)
    closeResourceTemplateChooser()
  }

  return (
    <div>
      <Modal show={ show } onHide={ () => closeResourceTemplateChooser() } bsSize="lg">
        <Modal.Header className="prop-heading" closeButton>
          <Modal.Title>
            Choose resource template
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="group-panel">
          <form className="group-select-options" >
            <div className="form-group">
              <label className="group-select-label" htmlFor="resourceTemplateSelect">
                Into which resource template do you want to load this resource?
              </label>
              <select data-testid="resourceTemplateSelect" id="resourceTemplateSelect"
                      defaultValue={ selectedValue } onBlur={ event => updateSelectedValue(event)} >
                { sortedResourceTemplateSummaries.map(summary => <option key={summary.key} value={ summary.id }>{ summary.name }</option>) }
              </select>
            </div>
            <div className="group-choose-buttons">
              <Button bsStyle="link" style={{ paddingRight: '20px' }} onClick={ () => closeResourceTemplateChooser() }>
                Cancel
              </Button>
              <Button bsStyle="primary" bsSize="small" onClick={ saveAndClose }>
                Save
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

ResourceTemplateChoiceModal.propTypes = {
  choose: PropTypes.func.isRequired,
}

export default ResourceTemplateChoiceModal
