// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { render } from '@testing-library/react'
import ModalWrapper from 'components/editor/ModalWrapper'

const testModal = () => {
  return (
    <div className="modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modal title</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Modal body text goes here.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>)
}


describe('A Modal Wrapper for moving modals to a different location in the DOM', () => {
  const portalRoot = document.createElement('div')
  portalRoot.setAttribute('id', 'modal')
  document.body.appendChild(portalRoot)

  const { getByText } = render(
    <ModalWrapper modal={testModal()} />,
  )

  it('modal is rendered in a div"', () => {
    expect(getByText('Modal title')).toBeInTheDocument()
  })
})
