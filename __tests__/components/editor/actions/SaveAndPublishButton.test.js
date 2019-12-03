// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { renderWithRedux, createReduxStore, createBlankState } from 'testUtils'
import SaveAndPublishButton from 'components/editor/actions/SaveAndPublishButton'

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
describe('<SaveAndPublishButton />', () => {
  it('is enabled if resource has changed and validation errors are not shown', () => {
    const store = createReduxStore(createInitialState())
    const { getByText } = renderWithRedux(
      <SaveAndPublishButton class="test" />, store,
    )
    expect(getByText('Save')).not.toBeDisabled()
  })
  it('is enabled if resource has changed and no validation errors', () => {
    const initialState = createInitialState()
    initialState.selectorReducer.editor.resourceValidation.show.abc123 = true
    const store = createReduxStore(initialState)
    const { getByText } = renderWithRedux(
      <SaveAndPublishButton class="test" />, store,
    )
    expect(getByText('Save')).not.toBeDisabled()
  })
  it('is disabled if resource has not changed', () => {
    const initialState = createInitialState()
    // See resourceHasChangesSinceLastSave() for checksum
    initialState.selectorReducer.editor.lastSaveChecksum.abc123 = '8300ef4c8fb6681ec4b62d2674502e84'
    const store = createReduxStore(initialState)
    const { getByText } = renderWithRedux(
      <SaveAndPublishButton class="test" />, store,
    )
    expect(getByText('Save')).toBeDisabled()
  })
  it('is disabled if resource has changed and has validation errors', () => {
    const initialState = createInitialState()
    initialState.selectorReducer.editor.resourceValidation.show.abc123 = true
    initialState.selectorReducer.editor.resourceValidation.errors.abc123 = [
      {
        message: 'Required',
        path: [
          'Barcode',
          'Barcode',
        ],
        reduxPath: [
          'resource',
          'resourceTemplate:bf2:Identifiers:Barcode',
          'http://www.w3.org/1999/02/22-rdf-syntax-ns#value',
        ],
      },
    ]
    const store = createReduxStore(initialState)
    const { getByText } = renderWithRedux(
      <SaveAndPublishButton class="test" />, store,
    )
    expect(getByText('Save')).toBeDisabled()
  })
})
