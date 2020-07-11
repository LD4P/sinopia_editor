// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useState } from 'react'
import { hideModal } from 'actions/modals'
import { saveResourceTemplates } from 'actionCreators/templates'
import { useDispatch, useSelector } from 'react-redux'
import ModalWrapper, { useDisplayStyle, useModalCss } from '../ModalWrapper'
import { resourceToName } from 'utilities/Utilities'
import { selectModalType, selectModalMessages } from 'selectors/modals'
import _ from 'lodash'

const UpdateResourceModal = () => {
  const dispatch = useDispatch()
  const show = useSelector((state) => selectModalType(state) === 'UpdateResourceModal')
  const messages = useSelector((state) => selectModalMessages(state))

  const [group, setGroup] = useState('')
  const [resourceTemplates, setResourceTemplates] = useState([])

  useEffect(() => {
    let group = ''
    const resourceTemplates = []
    messages.forEach((message) => {
      if (_.get(message, 'req._data.id')) {
        const req = message.req

        group = resourceToName(req.url)
        const resourceTemplate = req._data

        resourceTemplates.push(resourceTemplate)
      }
    })
    setResourceTemplates(resourceTemplates)
    setGroup(group)
  }, [messages])

  const handleClose = (event) => {
    dispatch(hideModal())
    event.preventDefault()
  }

  const handleOverwriteClick = (event) => {
    dispatch(saveResourceTemplates(resourceTemplates, group))
    dispatch(hideModal())
    event.preventDefault()
  }

  const resourceTemplateItems = resourceTemplates.map((resourceTemplate) => <li key={resourceTemplate.id}>{resourceTemplate.id}</li>)

  const modal = (
    <div className={ useModalCss(show) }
         id="update-resource-modal"
         data-testid="update-resource-modal"
         tabIndex="-1"
         role="dialog"
         style={{ display: useDisplayStyle(show) }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header" data-testid="update-resource-modal-header">
            <h4 className="modal-title">Do you want to overwrite these resource templates?</h4>
            <button type="button" className="close" onClick={handleClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body rdf-modal-content">
            <ul>
              { resourceTemplateItems }
            </ul>
            <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
              <button className="btn btn-link btn-sm" data-dismiss="modal" style={{ paddingRight: '20px' }} onClick={ handleClose }>
                Cancel
              </button>
              <button className="btn btn-primary btn-sm" data-dismiss="modal" onClick={ handleOverwriteClick }>
                Overwrite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>)

  return (<ModalWrapper modal={modal} />)
}

export default UpdateResourceModal
