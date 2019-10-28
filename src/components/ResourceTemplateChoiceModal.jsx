// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ModalWrapper, { useModalCss } from 'components/ModalWrapper'
import PropTypes from 'prop-types'
import { hideModal } from 'actions/index'

const ResourceTemplateChoiceModal = (props) => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.selectorReducer.editor.modal === 'ResourceTemplateChoiceModal')

  let display = 'none'

  if (show) {
    display = 'block'
  }

  const resourceTemplateSummaries = useSelector((state) => {
    const resourceTemplateSummaries = state.selectorReducer.entities.resourceTemplateSummaries
    return resourceTemplateSummaries ? Object.values(state.selectorReducer.entities.resourceTemplateSummaries) : []
  })
  const sortedResourceTemplateSummaries = useMemo(() => resourceTemplateSummaries.sort(
    (a, b) => a.name.localeCompare(b.name),
  ), [resourceTemplateSummaries])

  const defaultSelectedValue = sortedResourceTemplateSummaries.length > 0 ? sortedResourceTemplateSummaries[0].id : ''
  const [selectedValue, setSelectedValue] = useState(defaultSelectedValue)

  const updateSelectedValue = (event) => {
    event.preventDefault()
    setSelectedValue(event.target.value)
  }

  const close = (event) => {
    event.preventDefault()
    dispatch(hideModal())
  }

  const saveAndClose = (event) => {
    event.preventDefault()
    props.choose(selectedValue)
    close(event)
  }

  const modal = (
    <div className={ useModalCss(show) }
         tabIndex="-1"
         role="dialog"
         id="choose-rt" style={{ display }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header prop-heading">
            <h4 className="modal-title">Choose resource template</h4>
            <button type="button" className="close" onClick={ close } aria-label="Close">
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
                <button className="btn btn-primary btn-sm" onClick={event => saveAndClose(event) }>
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
