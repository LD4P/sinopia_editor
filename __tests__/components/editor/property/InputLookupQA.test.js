// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import InputLookupQA from 'components/editor/property/InputLookupQA'
import { fireEvent, waitForElement } from '@testing-library/react'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import Swagger from 'swagger-client'

jest.mock('swagger-client')

const createInitialState = () => {
  const state = createBlankState()
  state.selectorReducer.editor.currentResource = 'abc123'
  state.selectorReducer.entities.resourceTemplates = {
    'ld4p:RT:bf2:Agent:bfPerson': {
      propertyTemplates: [
        {
          repeatable: 'false',
          mandatory: 'true',
          type: 'lookup',
          valueConstraint: {
            useValuesFrom: [
              'urn:ld4p:qa:names:person',
            ],
          },
          propertyLabel: 'Search LCNAF',
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/Person',
          editable: 'true',
        },
      ],
      id: 'ld4p:RT:bf2:Agent:bfPerson',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Person',
      resourceLabel: 'Bibframe Person',
      author: 'LD4P',
      date: '2019-08-19',
      schema: 'https://ld4p.github.io/sinopia/schemas/0.2.0/resource-template.json',
    },
  }
  state.selectorReducer.entities.resources.abc123 = {
    'ld4p:RT:bf2:Agent:bfPerson': {
      'http://id.loc.gov/ontologies/bibframe/Person': {
        items: {},
      },
      'http://www.w3.org/2000/01/rdf-schema#label': {},
    },
  }

  return state
}

const response = {
  ok: true,
  url: 'https://lookup.ld4l.org/authorities/search/linked_data/locnames_rwo_ld4l_cache/person?q=justin&maxRecords=8&lang=en&context=true&response_header=true&startRecord=1',
  status: 200,
  statusText: 'OK',
  body: {
    results: [{
      uri: 'http://id.loc.gov/rwo/agents/no2007149444',
      id: 'no2007149444',
      label: 'Justin',
      context: [{
        property: 'Preferred label',
        values: ['Justin'],
        selectable: true,
        drillable: false,
      }, {
        property: 'Type',
        values: ['http://xmlns.com/foaf/0.1/Person', 'http://www.loc.gov/mads/rdf/v1#RWO', 'http://id.loc.gov/ontologies/bibframe/Person'],
        selectable: false,
        drillable: false,
      }, {
        property: 'VIAF match',
        values: ['http://viaf.org/viaf/sourceID/LC%7Cno2007149444#skos:Concept'],
        selectable: false,
        drillable: false,
      }, {
        property: 'Citation note',
        values: ['p. 13, etc. (Justin)', '(hdg.: Justin)'],
        selectable: false,
        drillable: false,
      }, {
        property: 'Citation source',
        values: ['His The millennium. Extracts from Vol. III of the Moral Advocate, 1828:', 'L\'Organiste à la Messe, 1887', '[Author of The millennium]', 'BL Catalogue of Printed Music, 25 Jan. 2010', '[Author of l\'Organiste à la Messe]', 'Cushing;Sharp;NUC pre-1956;Descriptive cat. of Friends\' books'],
        selectable: false,
        drillable: false,
      }, {
        property: 'Editorial note',
        values: ['[THIS 1XX FIELD CANNOT BE USED UNDER RDA UNTIL THIS UNDIFFERENTIATED RECORD HAS BEEN HANDLED FOLLOWING THE GUIDELINES IN DCM Z1 008/32]'],
        selectable: false,
        drillable: false,
      }],
    }, {
      uri: 'http://id.loc.gov/rwo/agents/no98127708',
      id: 'no 98127708',
      label: 'Justin, A.',
      context: [{
        property: 'Preferred label',
        values: ['Justin, A.'],
        selectable: true,
        drillable: false,
      }, {
        property: 'Type',
        values: ['http://xmlns.com/foaf/0.1/Person', 'http://www.loc.gov/mads/rdf/v1#RWO', 'http://id.loc.gov/ontologies/bibframe/Person'],
        selectable: false,
        drillable: false,
      }, {
        property: 'VIAF match',
        values: ['http://viaf.org/viaf/sourceID/LC%7Cno+98127708#skos:Concept'],
        selectable: false,
        drillable: false,
      }, {
        property: 'Citation note',
        values: ['t.p. (A. Justin)'],
        selectable: false,
        drillable: false,
      }, {
        property: 'Citation source',
        values: ['Justin, A. Separate collection in Belgium, 1979:'],
        selectable: false,
        drillable: false,
      }, {
        property: 'Editorial note',
        values: ['[Cannot identify with Justin, Anstice, or Justin, Augustus]'],
        selectable: false,
        drillable: false,
      }],
    }],
    response_header: {
      start_record: 1,
      requested_records: 8,
      retrieved_records: 8,
      total_records: 1000,
    },
  },
  authLabel: 'LOC person [names (rwo)] (QA)',
  authURI: 'urn:ld4p:qa:names:person',
  label: 'LOC person [names (rwo)] (QA)',
  id: 'urn:ld4p:qa:names:person',
}

setupModal()

const reduxPath = [
  'entities',
  'resources',
  'abc123',
  'ld4p:RT:bf2:Agent:bfPerson',
  'http://id.loc.gov/ontologies/bibframe/Person',
]

describe('InputLookupQA', () => {
  it('handles entering value', async () => {
    const mockActionFunction = jest.fn().mockResolvedValue(response)
    const client = { apis: { SearchQuery: { GET_searchSubauthority: mockActionFunction } } }
    Swagger.mockResolvedValue(client)

    const store = createReduxStore(createInitialState())
    const {
      getByPlaceholderText, getByText, queryByText,
    } = renderWithRedux(
      <InputLookupQA reduxPath={reduxPath} />, store,
    )

    // Add a value
    fireEvent.change(getByPlaceholderText('Search LCNAF'), { target: { value: 'justin' } })

    await waitForElement(() => queryByText('Justin'))
    expect(getByText('Justin, A.')).toBeInTheDocument()
  })
})
