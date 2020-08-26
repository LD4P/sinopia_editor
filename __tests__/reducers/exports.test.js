// Copyright 2020 Stanford University see LICENSE for license
import { exportsReceived } from 'reducers/exports'
import { createState } from 'stateUtils'

describe('exportsReceived', () => {
  const exportFilenames = [
    'alberta_2020-08-23T00:01:15.272Z.zip',
    'boulder_2020-08-23T00:01:14.781Z.zip',
  ]

  it('sets the list of export file names', () => {
    const newState = exportsReceived(createState().selectorReducer, { payload: exportFilenames })
    expect(newState).toMatchObject({
      entities: {
        exports: exportFilenames,
      },
    })
  })
})
