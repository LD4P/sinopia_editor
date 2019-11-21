// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import SinopiaResourceTemplates from 'components/templates/SinopiaResourceTemplates'
import * as sinopiaServer from 'sinopiaServer'
import { fireEvent, wait } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { renderWithReduxAndRouter, createReduxStore, createBlankState } from 'testUtils'
import { getFixtureResourceTemplate } from '../../fixtureLoaderHelper'
import { saveAs } from 'file-saver'

jest.mock('sinopiaServer')
jest.mock('file-saver')

const createInitialState = () => {
  const state = createBlankState()
  state.selectorReducer.resource = {
    'resourceTemplate:bf2:Note': {
      'http://id.loc.gov/ontologies/bibframe/note': {
        items: {},
      },
    },
  }
  state.selectorReducer.entities.resourceTemplates = {
    'resourceTemplate:bf2:Note': {
      id: 'resourceTemplate:bf2:Note',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
      resourceLabel: 'Note',
      propertyTemplates: [
        {
          propertyURI: 'http://www.w3.org/2000/01/rdf-schema#label',
          propertyLabel: 'Note',
          type: 'literal',
        },
      ],
    },
  }
  state.selectorReducer.templateSearch.results = [{
    id: 'resourceTemplate:bf2:Note',
    resourceLabel: 'Note',
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
    remark: 'very salient information',
    author: 'wright.lee.renønd',
    date: '2019-11-01',
  }, {
    id: 'resourceTemplate:bf2:Alternative',
    resourceLabel: 'Alternative',
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/Alternative',
  }]
  state.selectorReducer.templateSearch.totalResults = 2
  state.selectorReducer.historicalTemplates.results = [{
    id: 'resourceTemplate:bf2:Note',
    resourceLabel: 'Note',
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/Note',
    remark: 'very salient information',
    author: 'wright.lee.renønd',
    date: '2019-11-01',
  }, {
    id: 'resourceTemplate:bf2:Alternative',
    resourceLabel: 'Alternative',
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/Alternative',
  }]
  state.selectorReducer.historicalTemplates.totalResults = 2
  return state
}

sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)

describe('SinopiaResourceTemplates', () => {
  it('displays a list of resource templates with links to load and to download the resources', async () => {
    const store = createReduxStore(createInitialState())
    const history = createMemoryHistory()

    const {
      container, getAllByText, getAllByTestId,
    } = renderWithReduxAndRouter(
      <SinopiaResourceTemplates history={history} />, store,
    )
    // There are 2 tables with heading and header columns
    expect(container.querySelector('table.resource-template-list')).toBeInTheDocument()
    expect(getAllByText(/ID/).length).toEqual(2)
    expect(getAllByText(/Resource URI/).length).toEqual(2)
    expect(getAllByText(/Author/).length).toEqual(2)
    expect(getAllByText(/Date/).length).toEqual(2)
    expect(getAllByText(/Guiding statement/).length).toEqual(2)
    expect(getAllByTestId(/download-col-header/).length).toEqual(2)


    expect(getAllByText('resourceTemplate:bf2:Note').length).toEqual(2)
    expect(getAllByText('resourceTemplate:bf2:Alternative').length).toEqual(2)
    expect(getAllByText('Note').length).toEqual(2)
    expect(getAllByText('http://id.loc.gov/ontologies/bibframe/Note').length).toEqual(2)
    expect(getAllByText('very salient information').length).toEqual(2)
    expect(getAllByText('wright.lee.renønd').length).toEqual(2)
    expect(getAllByText('Nov 1, 2019').length).toEqual(2)

    // There is a link from the resource label that loads the resource into the editor tab
    expect(container.querySelector('a[href="/editor"]')).toBeInTheDocument()
    fireEvent.click(getAllByText('Note')[0])
    await wait(() => expect(history.location.pathname).toBe('/editor/resourceTemplate:bf2:Note'))

    // There is download link
    saveAs.mockReturnValue('file saved')

    fireEvent.click(getAllByTestId('download-link')[0])
    expect(saveAs()).toMatch('file saved')
  })
  it('displays errors', async () => {
    const state = createInitialState()
    state.selectorReducer.editor.errors = {
      newresource: ['Ooops'],
    }
    const store = createReduxStore(state)

    const { getByText } = renderWithReduxAndRouter(
      <SinopiaResourceTemplates history={{}} />, store,
    )

    expect(getByText('Ooops')).toBeInTheDocument()
  })
})
