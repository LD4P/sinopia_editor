// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import PreviewButton from 'components/editor/actions/PreviewButton'
import appReducer from 'reducers/index'
import { renderWithRedux } from 'testUtils'
import { fireEvent, wait } from '@testing-library/react'

describe('When the button is clicked', () => {
  const store = createStore(appReducer, {
    selectorReducer: {
      entities: {},
      resource: {},
      editor: {
        rdfPreview: {
          show: false,
        },
      },
    },
  })
  const { getByTitle } = renderWithRedux(
    <PreviewButton />, store,
  )

  it('shows the preview', async () => {
    fireEvent.click(getByTitle('Preview RDF'))
    await wait(() => {
      expect(store.getState().selectorReducer.editor.modal).toMatch('RDFModal')
    })
  })
})
