// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ModalWrapper from 'components/editor/ModalWrapper'
import PropTypes from 'prop-types'
import { closeResourceTemplateChooser as closeResourceTemplateChooserAction, hideModal } from 'actions/index'

const ResourceTemplateChoiceModal = (props) => {
  const dispatch = useDispatch()
  /* eslint no-unused-vars: "off" */
  const closeResourceTemplateChooser = () => dispatch(closeResourceTemplateChooserAction())

  const show = useSelector(state => state.selectorReducer.editor.resourceTemplateChoice.show)
  const classes = ['modal', 'fade']
  let display = 'none'

  if (show) {
    classes.push('show')
    display = 'block'
  }

  const resourceTemplateSummaries = useSelector(state => Object.values(state.selectorReducer.entities.resourceTemplateSummaries))
  const sortedResourceTemplateSummaries = useMemo(() => resourceTemplateSummaries.sort(
    (a, b) => a.name.localeCompare(b.name),
  ), [resourceTemplateSummaries])

  const defaultSelectedValue = sortedResourceTemplateSummaries.length > 0 ? sortedResourceTemplateSummaries[0].id : ''
  const [selectedValue, setSelectedValue] = useState(defaultSelectedValue)

  const updateSelectedValue = (event) => {
    event.preventDefault()
    setSelectedValue(event.target.value)
  }

  const close = () => {
    hideModal()
  }

  const saveAndClose = () => {
    props.choose(selectedValue)
    close()
  }

  const modal = (
    <div className={ classes.join(' ') }
         tabIndex="-1"
         role="dialog"
         id="choose-rt" style={{ display }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header prop-heading">
            <h4 className="modal-title">Choose resource template</h4>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form className="group-select-options">
            <div className="modal-body group-panel">
              <label className="group-select-label" htmlFor="resourceTemplateSelect">
              Into which resource template do you want to load this resource?
              </label>
              <select className="form-control"
                      data-testid="resourceTemplateSelect"
                      id="resourceTemplateSelect"
                      defaultValue={ selectedValue } onBlur={ event => updateSelectedValue(event)} >
                { sortedResourceTemplateSummaries.map(summary => <option key={summary.key} value={ summary.id }>{ summary.name }</option>) }
              </select>
              <div className="group-choose-buttons">
                <button className="btn btn-link" style={{ paddingRight: '20px' }} onClick={ close }>
                  Cancel
                </button>
                <button className="btn btn-primary btn-sm" onClick={ saveAndClose }>
                 Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  return (<ModalWrapper modal={modal} />)
}

ResourceTemplateChoiceModal.propTypes = {
  choose: PropTypes.func.isRequired,
}

export default ResourceTemplateChoiceModal
