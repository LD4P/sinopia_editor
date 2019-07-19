// Copyright 2019 Stanford University see LICENSE for license

import { clearResourceTemplates } from 'reducers/entities'
import { createReducer } from 'reducers/index'

describe('clearResourceTemplates', () => {
  it('removes all resource templates', () => {
    const handlers = { CLEAR_RESOURCE_TEMPLATES: clearResourceTemplates }
    const oldState = {
      entities: {
        resourceTemplates: {
          'resourceTemplate:bf2:Monograph:Instance': {
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
          },
        },
      },
    }

    const action = {
      type: 'CLEAR_RESOURCE_TEMPLATES',
    }

    const reducer = createReducer(handlers)
    const newState = reducer(oldState, action)
    expect(newState).toEqual({
      entities: {
        resourceTemplates: {},
      },
    })
  })
})
