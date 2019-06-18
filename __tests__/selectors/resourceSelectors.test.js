// Copyright 2019 Stanford University see LICENSE for license

import {
  rootResourceId,
} from 'selectors/resourceSelectors'

describe('rootResourceId', () => {
  const state = {
    selectorReducer: {
      resource: {
        'profile:bf2:Work': {
          resourceURI: 'http://platform:8080/repository/stanford/1f14d358-a0c9-4e66-b7e8-7c6ae5475036',
        },
      },
    },
  }

  it('returns the uri', () => {
    expect(rootResourceId(state)).toEqual('http://platform:8080/repository/stanford/1f14d358-a0c9-4e66-b7e8-7c6ae5475036')
  })
})
