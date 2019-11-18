// Copyright 2019 Stanford University see LICENSE for license
import React from 'react'
import { wait } from '@testing-library/react'
import ResultList from 'components/editor/property/ResourceList'

import * as sinopiaSearch from 'sinopiaSearch'
import {
  renderWithReduxAndRouter, createReduxStore, createBlankState,
} from 'testUtils'

jest.mock('sinopiaSearch')
// eslint-disable-next-line import/namespace
sinopiaSearch.getTemplateSearchResults = jest.fn().mockResolvedValue(
  {
    error: undefined,
    results: [{
      author: undefined,
      date: undefined,
      id: 'resourceTemplate:bf2:Monograph:Instance',
      remark: 'This is altered greatly for testing purposes',
      resourceLabel: 'BIBFRAME Instance',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
    },
    ],
    totalHits: 1,
  },
)

describe('ResultList', () => {
  it('it displays a list of links to existing resource templates', async () => {
    const state = createBlankState()
    state.selectorReducer.entities = {
      resourceTemplates: {
        'test:resource:SinopiaLookup': {
          id: 'test:resource:SinopiaLookup',
          resourceLabel: 'Testing sinopia lookup',
          remark: 'This hits elasticsearch',
          resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
          propertyTemplates: [
            {
              propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
              propertyLabel: 'Instance of (lookup)',
              remark: 'lookup',
              mandatory: 'true',
              repeatable: 'false',
              type: 'lookup',
              resourceTemplates: [],
              valueConstraint: {
                valueTemplateRefs: [],
                useValuesFrom: [
                  'urn:ld4p:sinopia:bibframe:instance',
                  'urn:ld4p:sinopia:bibframe:work',
                ],
                valueDataType: {},
                defaults: [],
              },
              editable: 'true',
            },
          ],
        },
      },
    }
    const store = createReduxStore(state)
    const reduxPath = [
      'entities',
      'resources',
      'puSv04OT',
      'test:resource:SinopiaLookup',
      'http://id.loc.gov/ontologies/bibframe/instanceOf',
    ]
    const { getByText } = renderWithReduxAndRouter(
      <ResultList reduxPath={reduxPath} />,
      store,
    )

    await wait(() => {
      expect(getByText('Create New:')).toBeInTheDocument()
      expect(getByText('BIBFRAME Instance')).toBeInTheDocument()
    })
  })
})
