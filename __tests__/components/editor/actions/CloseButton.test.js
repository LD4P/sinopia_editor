// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import {
  renderWithReduxAndRouter, createReduxStore, createBlankState, setupModal,
} from 'testUtils'
import CloseButton from 'components/editor/actions/CloseButton'
import { fireEvent } from '@testing-library/react'

const createInitialState = () => {
  const state = createBlankState()
  state.selectorReducer.editor.currentResource = 'abc123'
  state.selectorReducer.editor.lastSaveChecksum.abc123 = '54527c024d0021784f666c2794856938'
  state.selectorReducer.entities.resources.abc123 = {
    'resourceTemplate:bf2:Identifiers:Barcode': {
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {
        items: {
          hPSHr9jA: {
            content: '123456',
            lang: 'eng',
          },
        },
      },
      'http://id.loc.gov/ontologies/bibframe/enumerationAndChronology': {},
    },
  }
  state.selectorReducer.entities.resourceTemplates = {
    'resourceTemplate:bf2:Identifiers:Barcode': {
      id: 'resourceTemplate:bf2:Identifiers:Barcode',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Barcode',
      resourceLabel: 'Barcode',
      propertyTemplates: [
        {
          mandatory: 'true',
          repeatable: 'false',
          type: 'literal',
          resourceTemplates: [],
          valueConstraint: {
            valueTemplateRefs: [],
            useValuesFrom: [],
            valueDataType: {},
            defaults: [
              {
                defaultLiteral: '12345',
              },
            ],
          },
          propertyURI: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
          propertyLabel: 'Barcode',
          editable: 'true',
        },
        {
          mandatory: 'false',
          repeatable: 'true',
          type: 'literal',
          resourceTemplates: [],
          valueConstraint: {
            valueTemplateRefs: [],
            useValuesFrom: [],
            valueDataType: {},
          },
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/enumerationAndChronology',
          propertyLabel: 'Enumeration and chronology',
          editable: 'true',
        },
      ],
    },
  }
  return state
}

// Clicking the button is covered by previewSaveIncompleteResource and previewSaveResource
describe('<CloseButton />', () => {
  setupModal()
  it('renders', () => {
    const store = createReduxStore(createInitialState())
    const { getByTitle, getByTestId } = renderWithReduxAndRouter(
      <CloseButton />, store,
    )

    expect(getByTitle('Close', { selector: 'button' })).toBeInTheDocument()
    expect(getByTestId('close-resource-modal').classList.contains('show')).toBe(false)
  })

  describe('closing when resource has not changed', () => {
    const state = createInitialState()
    // See resourceHasChangesSinceLastSave() for checksum
    state.selectorReducer.editor.lastSaveChecksum.abc123 = '5267eb8da0ab5ef646cae0190cf13a7c'
    const store = createReduxStore(state)

    it('clears the resource', () => {
      const { getByTitle } = renderWithReduxAndRouter(
        <CloseButton />, store,
      )
      fireEvent.click(getByTitle('Close'))

      // Resource has been cleared
      expect(store.getState().selectorReducer.editor.currentResource).toEqual(undefined)
    })
  })
  describe('closing when resource has changed', () => {
    const store = createReduxStore(createInitialState())

    it('opens the close resource modal', () => {
      const { getByTitle, getByTestId } = renderWithReduxAndRouter(
        <CloseButton />, store,
      )
      fireEvent.click(getByTitle('Close'))

      // Modal opened
      expect(getByTestId('close-resource-modal').classList.contains('show')).toBe(true)
    })
  })
})
