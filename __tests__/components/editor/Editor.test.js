// Copyright 2018, 2019 Stanford University see LICENSE for license

import React from 'react'
import {
  renderWithReduxAndRouter, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import Editor from 'components/editor/Editor'

const props = {
  location: { state: { resourceTemplateId: 'resourceTemplate:bf:Note' } },
  userWantsToSave: jest.fn(),
  saveError: 'oops',
}


const createInitialState = (options = {}) => {
  const state = createBlankState()
  state.selectorReducer.appVersion.version = '9.3'
  state.selectorReducer.resource = {
    'resourceTemplate:bf2:WorkTitle': {
      'http://id.loc.gov/ontologies/bibframe/mainTitle': {
        items: {},
      },
    },
  }
  state.selectorReducer.entities.resourceTemplates = {
    'resourceTemplate:bf2:WorkTitle': {
      id: 'resourceTemplate:bf2:WorkTitle',
      resourceLabel: 'Work Title',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Title',
      propertyTemplates: [
        {
          propertyURI: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
          propertyLabel: 'Preferred Title for Work',
          remark: 'http://access.rdatoolkit.org/rdachp6_rda6-2036.html',
          mandatory: 'false',
          repeatable: 'true',
          type: 'literal',
          resourceTemplates: [],
          valueConstraint: {
            valueTemplateRefs: [],
            useValuesFrom: [],
            valueDataType: {},
            defaults: [],
          },
        },
      ],
    },
  }
  state.selectorReducer.editor.copyToNewMessage = {
    timestamp: Date.now(),
    oldUri: 'https://sinopia.io/pcc/1345',
  }

  if (options.loggedIn) {
    state.authenticate = {
      authenticationState: {
        currentSession: {
          dummy: 'blah',
        },
      },
    }
  }


  return state
}

// See https://github.com/nodesecurity/eslint-plugin-security/issues/26
/* eslint security/detect-non-literal-fs-filename: 'off' */

describe('<Editor />', () => {
  setupModal()

  describe('any user', () => {
    const store = createReduxStore(createInitialState())

    it('renders the component', () => {
      const { queryByText } = renderWithReduxAndRouter(
        <Editor {...props}/>, store,
      )
      expect(queryByText(/Preferred Title for Work/)).toBeInTheDocument()
      expect(queryByText('LINKED DATA EDITOR')).toBeInTheDocument()
      expect(queryByText(/Alert! No data can be saved unless you are logged in with group permissions./)).toBeInTheDocument()
    })
  })

  describe('authenticated user', () => {
    const store = createReduxStore(createInitialState({ loggedIn: true }))

    it('does not displays a login warning message', () => {
      const { queryByText } = renderWithReduxAndRouter(
        <Editor {...props}/>, store,
      )
      expect(queryByText(/Alert! No data can be saved unless you are logged in with group permissions./)).not.toBeInTheDocument()
    })
  })
})
