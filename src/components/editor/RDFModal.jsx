// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { modalType } from 'selectors/modalSelectors'
import { hideModal } from 'actions/modals'
import GraphBuilder from 'GraphBuilder'
import ModalWrapper, { useDisplayStyle, useModalCss } from '../ModalWrapper'
import SaveAndPublishButton from './actions/SaveAndPublishButton'
import RDFDisplay from './RDFDisplay'
import { findResource } from 'selectors/resourceSelectors'

const RDFModal = (props) => {
  const dispatch = useDispatch()

  const handleClose = (event) => {
    dispatch(hideModal())
    event.preventDefault()
  }

  const modal = (
    <div className={ useModalCss(props.show) }
         id="rdf-modal"
         data-testid="rdf-modal"
         tabIndex="-1"
         role="dialog"
         style={{ display: useDisplayStyle(props.show) }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header" data-testid="rdf-modal-header">
            <h4 className="modal-title">RDF Preview</h4>
            <button type="button" className="close" onClick={handleClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body rdf-modal-content">
            <div className="row" style={{ marginLeft: '0', marginRight: '0' }}>
              <div className="col-sm-6">If this looks good, then click Save and Publish</div>
              <div className="col-sm-6" style={{ textAlign: 'right' }}>
                <SaveAndPublishButton class="modal-save" />
              </div>
            </div>
            <RDFDisplay rdf={props.rdf()} />
          </div>
        </div>
      </div>
    </div>)

  return (<ModalWrapper modal={modal} />)
}

RDFModal.propTypes = {
  show: PropTypes.bool,
  rdf: PropTypes.func,
}

const mapStateToProps = state => ({
  show: modalType(state) === 'RDFModal',
  rdf: () => new GraphBuilder(findResource(state), state.selectorReducer.entities.resourceTemplates).graph.toCanonical(),
})

export default connect(mapStateToProps, null)(RDFModal)
