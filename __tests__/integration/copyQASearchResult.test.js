import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore } from 'testUtils'
import App from 'components/App'
import { MemoryRouter } from 'react-router-dom'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'
/* eslint import/namespace: 'off' */
import * as sinopiaServer from 'sinopiaServer'
import Swagger from 'swagger-client'

jest.mock('swagger-client')
jest.mock('sinopiaServer')

const resourceTemplateSummaries = {
  'resourceTemplate:bf2:Monograph:Work': {
    key: 'resourceTemplate:bf2:Monograph:Work',
    name: 'BIBFRAME Work',
    id: 'resourceTemplate:bf2:Monograph:Work',
    group: 'ld4p',
  },
}

const createInitialState = () => {
  return {
    authenticate: {
      authenticationState: {
        currentSession: {
          idToken: {},
        },
      },
    },
    selectorReducer: {
      resource: {},
      entities: {
        resourceTemplateSummaries,
        resourceTemplates: {},
        languages: {
          loading: false,
          options: [
            {
              id: 'en',
              label: 'English',
            },
          ],
        },
        lookups: {},
      },
      editor: {
        resourceValidationErrors: {},
        copyToNewMessage: {
          show: false,
        },
        rdfPreview: {
          show: true,
        },
        groupChoice: {
          show: false,
        },
        resourceTemplateChoice: {
          show: false,
        },
        expanded: {},
      },
      appVersion: {
        version: undefined,
        lastChecked: Date.now(),
      },
      search: {
        results: [],
        totalResults: 0,
        query: undefined,
        uri: undefined,
      },
    },
  }
}

describe('Search, copy QA result, and open in editor', () => {
  // Mock out search
  const mockSearchResults = [
    {
      uri: 'http://share-vde.org/sharevde/rdfBibframe/Work/9c9b8795-42a4-321d-9b43-caeb0795c61a',
      id: 'http://share-vde.org/sharevde/rdfBibframe/Work/9c9b8795-42a4-321d-9b43-caeb0795c61a',
      label: 'These twain',
      context: [
        {
          property: 'Title',
          values: [
            'These twain',
          ],
          selectable: true,
          drillable: false,
        },
        {
          property: 'Type',
          values: [
            'http://id.loc.gov/ontologies/bflc/Hub',
            'http://id.loc.gov/ontologies/bibframe/Work',
          ],
          selectable: false,
          drillable: false,
        },
        {
          property: 'Contributor',
          values: [
            'Bennett, Arnold,1867-1931.',
          ],
          selectable: false,
          drillable: false,
        },
      ],
    }]
  const mockActionFunction = jest.fn().mockResolvedValue({ body: mockSearchResults })
  const client = { apis: { SearchQuery: { GET_searchAuthority: mockActionFunction } } }
  Swagger.mockResolvedValue(client)

  // Mock out fetching the resource from QA
  const n3 = `@prefix bf2: <http://id.loc.gov/ontologies/bibframe/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<http://share-vde.org/sharevde/rdfBibframe/Work/9c9b8795-42a4-321d-9b43-caeb0795c61a> a <http://id.loc.gov/ontologies/bflc/Hub>,
  bf2:Work;
rdfs:label "These twain.";
bf2:hasExpression <http://share-vde.org/sharevde/rdfBibframe/Work/cfb8c113-a38b-31ae-9d55-dc4b44ca8a25>;
bf2:title <http://share-vde.org/sharevde/rdfBibframe/Title/9c9b8795-42a4-321d-9b43-caeb0795c61a> .
<http://share-vde.org/sharevde/rdfBibframe/Title/9c9b8795-42a4-321d-9b43-caeb0795c61a> a bf2:Title;
rdfs:label "These twain.";
<http://id.loc.gov/ontologies/bflc/title40MarcKey> "7400 $aThese twain.";
<http://id.loc.gov/ontologies/bflc/title40MatchKey> "These twain.";
<http://id.loc.gov/ontologies/bflc/titleSortKey> "These twain." .`
  global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ text: () => n3 }))
  sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  sinopiaServer.foundResourceTemplate.mockResolvedValue(true)
  sinopiaServer.listResourcesInGroupContainer.mockResolvedValue({ response: { body: { contains: false } } })

  const store = createReduxStore(createInitialState())
  const {
    getByText, queryByText, getByTitle,
    findByText, getByLabelText, getByDisplayValue, container,
  } = renderWithRedux(
    (<MemoryRouter><App /></MemoryRouter>), store,
  )

  it('searches, fetches the resource, and opens in editor', async () => {
    // Open the resource
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.click(getByText('Search'))

    expect(getByLabelText('Search')).toBeInTheDocument()

    // Select an authority
    fireEvent.change(getByDisplayValue('Sinopia'), { target: { value: 'urn:ld4p:qa:sharevde_stanford_ld4l_cache:all' } })

    // Enter a query
    fireEvent.change(getByLabelText('Query'), { target: { value: 'twain' } })

    // Click search
    fireEvent.click(container.querySelector('button[type="submit"]'))

    // Display results
    expect(await findByText('These twain')).toBeInTheDocument()

    // Click copy
    fireEvent.click(getByTitle('Copy'))

    // Resource template choice modal open
    expect(getByText('Choose resource template')).toBeInTheDocument()
    expect(getByText('BIBFRAME Work')).toBeInTheDocument()
    fireEvent.click(getByText('Save'))
    await wait(() => expect(queryByText('Choose resource template')).not.toBeInTheDocument())

    // Opens editor
    expect(await findByText(/Unable to load the entire resource/)).toBeInTheDocument()
    expect(getByText('These twain.', 'div.rbt-token')).toBeInTheDocument()
  })
})
