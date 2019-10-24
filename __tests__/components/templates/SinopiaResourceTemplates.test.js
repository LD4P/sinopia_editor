// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import SinopiaResourceTemplates from 'components/templates/SinopiaResourceTemplates'
import * as sinopiaServer from 'sinopiaServer'
import { fireEvent, wait } from '@testing-library/react'
import { createMemoryHistory } from 'history'
/* eslint import/no-unresolved: 'off' */
import { renderWithReduxAndRouter, createReduxStore } from 'testUtils'
import { getFixtureResourceTemplate } from '../../fixtureLoaderHelper'
import { saveAs } from 'file-saver'

jest.mock('sinopiaServer')
jest.mock('file-saver')

const createInitialState = () => {
  const state = {
    selectorReducer: {
      resource: {
        'resourceTemplate:bf2:Note': {
          'http://id.loc.gov/ontologies/bibframe/note': {
            items: {},
          },
        },
      },
      entities: {
        resourceTemplateSummaries,
        resourceTemplates: {
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
        },
      },
      editor: {
        serverError: '',
        resourceValidation: {
          show: false,
        },
      },
    },

  }
  return state
}

const resourceTemplateSummaries = [
  {
    name: 'Note',
    key: 'resourceTemplate:bf2:Note',
    id: 'resourceTemplate:bf2:Note',
    author: 'wright.lee.renønd',
    remark: 'very salient information',
    group: 'ld4p',
  },
  {
    name: 'First Thing',
    key: 'resourceTemplate:bf2:Alternative',
    id: 'resourceTemplate:bf2:Alternative',
    author: 'bob',
    remark: 'very salient information',
    group: 'ld4p',
  },
]

describe('SinopiaResourceTemplates', () => {
  it('displays a list of resource templates with links to load and to download the resources', async () => {
    const store = createReduxStore(createInitialState())
    const history = createMemoryHistory()

    sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)

    const {
      container, getByText, getByTestId, getAllByTestId, queryAllByTestId,
    } = renderWithReduxAndRouter(
      <SinopiaResourceTemplates messages={[]} history={history} />, store,
    )
    // There is a table with heading and header columns
    expect(getByText('Available Resource Templates in Sinopia')).toBeInTheDocument()
    expect(container.querySelector('table#resource-template-list')).toBeInTheDocument()
    expect(getByText(/Template name/)).toBeInTheDocument()
    expect(getByText(/ID/)).toBeInTheDocument()
    expect(getByText(/Author/)).toBeInTheDocument()
    expect(getByText(/Guiding statement/)).toBeInTheDocument()
    expect(getByTestId('download-col-header')).toBeInTheDocument()

    // Sorting
    expect(queryAllByTestId('name').map(obj => obj.children[0].text)).toEqual(['First Thing', 'Note'])
    fireEvent.click(getByText('Template name'))
    expect(queryAllByTestId('name').map(obj => obj.children[0].text)).toEqual(['Note', 'First Thing'])


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
})
