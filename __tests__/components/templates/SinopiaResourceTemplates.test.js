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
// jest.mock('Download')
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
      },
    },

  }
  return state
}

const resourceTemplateSummary = {
  name: 'Note',
  key: 'resourceTemplate:bf2:Note',
  id: 'resourceTemplate:bf2:Note',
  author: 'wright.lee.renønd',
  remark: 'very salient information',
  group: 'ld4p',
}

const resourceTemplateSummaries = [resourceTemplateSummary]

describe('SinopiaResourceTemplates', () => {
  it('displays a list of resource templates with links to load and to download the resources', async () => {
    const store = createReduxStore(createInitialState())
    const history = createMemoryHistory()

  it('has a bootstrap table that displays the results from the calls to sinopia_server', () => {
    expect(wrapper.find('.table').length).toEqual(1)
  })

  describe('display', () => {
    const wrapper = shallow(<SinopiaResourceTemplates.WrappedComponent messages={[]} resourceTemplateSummaries={resourceTemplateSummaries} />)

    it('renders the table of resource templates with name, id, author, guiding statement, download columns', () => {
      const tableHeaderCellText = wrapper.find('div > table > thead > tr > th')
      expect(tableHeaderCellText.at(0).text()).toEqual('Template name')
      expect(tableHeaderCellText.at(1).text()).toEqual('ID')
      expect(tableHeaderCellText.at(2).text()).toEqual('Author')
      expect(tableHeaderCellText.at(3).text()).toEqual('Guiding statement')
      expect(tableHeaderCellText.at(4).text()).toEqual('Download')
    })
  })

  describe('linking back to the Editor component', () => {
    it('renders a link to the Editor', () => {
      expect.assertions(1)
      const link = wrapper.find('Link')
      expect(link.props().to.pathname).toEqual('/editor')
    })
  })
  describe('linking to download the template', () => {
    it('renders a link to download the template', () => {
      expect.assertions(2)
      const link = wrapper.find('Download')

      expect(link.props().resourceTemplateId).toEqual('ld4p:resourceTemplate:bf2:Note')
      expect(link.props().groupName).toEqual('stanford')
    })
  })
})
