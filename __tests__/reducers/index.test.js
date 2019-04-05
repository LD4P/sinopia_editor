// Copyright 2019 Stanford University see Apache2.txt for license

import { refreshResourceTemplate  } from '../../src/reducers/index'

describe(`Takes a resource template ID and populates the global state`, () => {

  it('passing a payload to an empty state', () => {
    const emptyStateResult = refreshResourceTemplate({}, {
      type:  'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['http://sinopia.io/example']
      }
    })
    expect(emptyStateResult).toEqual({
      'http://sinopia.io/example': { items: { items: [] } }
    })

  })

  it(`missing reduxPath in payload should return the state`, () => {
    const missingPayload = refreshResourceTemplate({}, {
      type:  'REFRESH_RESOURCE_TEMPLATE',
      payload: {}
    })
    expect(missingPayload).toEqual({})
  })

  it('tests with a more realistic payload with defaults', () => {
    const defaultStateResult = refreshResourceTemplate({}, {
      type: 'REFRESH_RESOURCE_TEMPLATE',
      payload: {
        reduxPath: ['resourceTemplate:bf2:Item', 'http://schema.org/name'],
        defaults: ['Sinopia Name']
      }
    })
    expect(defaultStateResult).toEqual({
      'resourceTemplate:bf2:Item': {
        'http://schema.org/name':{
          items: [ "Sinopia Name" ]
        }
      }
    })
  })
})
