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
  return state
}

sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)

describe('SinopiaResourceTemplates', () => {
  it('displays a list of resource templates with links to load and to download the resources', async () => {
    const store = createReduxStore(createInitialState())
    const history = createMemoryHistory()

    const {
      container, getByText, getByTestId, getAllByTestId,
    } = renderWithReduxAndRouter(
      <SinopiaResourceTemplates history={history} />, store,
    )
    // There is a table with heading and header columns
    expect(container.querySelector('table#resource-template-list')).toBeInTheDocument()
    expect(getByText(/Label/)).toBeInTheDocument()
    expect(getByText(/ID/)).toBeInTheDocument()
    expect(getByText(/Resource URI/)).toBeInTheDocument()
    expect(getByText(/Author/)).toBeInTheDocument()
    expect(getByText(/Date/)).toBeInTheDocument()
    expect(getByText(/Guiding statement/)).toBeInTheDocument()
    expect(getByTestId('download-col-header')).toBeInTheDocument()

    expect(getByText('resourceTemplate:bf2:Note')).toBeInTheDocument()
    expect(getByText('resourceTemplate:bf2:Alternative')).toBeInTheDocument()
    expect(getByText('Note')).toBeInTheDocument()
    expect(getByText('http://id.loc.gov/ontologies/bibframe/Note')).toBeInTheDocument()
    expect(getByText('very salient information')).toBeInTheDocument()
    expect(getByText('wright.lee.renønd')).toBeInTheDocument()
    expect(getByText('2019-11-01')).toBeInTheDocument()

    // There is a link from the resource label that loads the resource into the editor tab
    expect(container.querySelector('a[href="/editor"]')).toBeInTheDocument()
    fireEvent.click(getByText('Note'))
    await wait(() => expect(history.location.pathname).toBe('/editor/resourceTemplate:bf2:Note'))

    // There is download link
    saveAs.mockReturnValue('file saved')
    expect(container.querySelector('button.btn-linky')).toBeInTheDocument()
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
